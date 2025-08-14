import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';
import { authenticateRequest, isHROrAdmin, createAuthErrorResponse, createPermissionErrorResponse } from '@/lib/auth';

// 职位数据验证模式
const jobSchema = z.object({
  title: z.string().min(1, '职位名称不能为空'),
  department: z.string().min(1, '部门不能为空'),
  location: z.string().min(1, '工作地点不能为空'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  description: z.string().min(1, '职位描述不能为空'),
  requirements: z.array(z.string()).min(1, '职位要求不能为空'),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  salary: z.string().optional(),
  experience: z.string().optional(),
  isUrgent: z.boolean().optional().default(false),
  isRemote: z.boolean().optional().default(false),
  deadline: z.string().optional(),
  status: z.enum(['draft', 'published', 'closed']).optional().default('published')
});



// GET - 获取所有职位（管理员视图，包括草稿）
export async function GET(request: NextRequest) {
  try {
    // 验证用户身份和权限
    const user = await authenticateRequest(request);
    if (!user) {
      return createAuthErrorResponse('请先登录');
    }
    
    if (!isHROrAdmin(user)) {
      return createPermissionErrorResponse('只有HR或管理员可以访问此功能');
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const department = searchParams.get('department');
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // 管理员可以查看所有状态

    // 从数据库获取所有职位（包括草稿）
    const allJobs = await db.getAllJobsForAdmin();
    
    // 筛选职位
    let filteredJobs = allJobs.filter(job => {
      if (status && job.status !== status) return false;
      if (department && job.department !== department) return false;
      if (type && job.type !== type) return false;
      if (location && job.location !== location) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.department.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

    // 按创建时间倒序排列
    filteredJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const total = filteredJobs.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedJobs = filteredJobs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        items: paginatedJobs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('获取职位列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取职位列表失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// POST - 创建新职位
export async function POST(request: NextRequest) {
  try {
    // 验证用户身份和权限
    const user = await authenticateRequest(request);
    if (!user) {
      return createAuthErrorResponse('请先登录');
    }
    
    if (!isHROrAdmin(user)) {
      return createPermissionErrorResponse('只有HR或管理员可以创建职位');
    }
    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    const jobData = {
      ...validatedData,
      postedAt: new Date().toISOString().split('T')[0],
      responsibilities: validatedData.responsibilities || [],
      benefits: validatedData.benefits || [],
      salary: validatedData.salary || '',
      experience: validatedData.experience || '',
      deadline: validatedData.deadline || '',
      isUrgent: validatedData.isUrgent || false,
      isRemote: validatedData.isRemote || false,
      status: validatedData.status || 'published'
    };

    const newJob = db.createJob(jobData);

    return NextResponse.json({
      success: true,
      data: newJob,
      message: '职位创建成功'
    });
  } catch (error) {
    console.error('创建职位失败:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '数据验证失败',
          details: error.issues,
          message: '请检查输入数据'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '创建职位失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// PUT - 批量更新职位状态
export async function PUT(request: NextRequest) {
  try {
    // 验证用户身份和权限
    const user = await authenticateRequest(request);
    if (!user) {
      return createAuthErrorResponse('请先登录');
    }
    
    if (!isHROrAdmin(user)) {
      return createPermissionErrorResponse('只有HR或管理员可以更新职位');
    }
    const body = await request.json();
    const { ids, status } = body;

    if (!Array.isArray(ids) || !status) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: '请提供有效的职位ID列表和状态'
        },
        { status: 400 }
      );
    }

    const updatedJobs = [];
    for (const id of ids) {
      const existingJob = await db.getJobById(id);
      if (existingJob) {
        const updatedJob = await db.updateJob(id, { status });
        if (updatedJob) {
          updatedJobs.push(updatedJob);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedJobs,
      message: `成功更新 ${updatedJobs.length} 个职位状态`
    });
  } catch (error) {
    console.error('批量更新职位失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量更新职位失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// DELETE - 批量删除职位
export async function DELETE(request: NextRequest) {
  try {
    // 验证用户身份和权限
    const user = await authenticateRequest(request);
    if (!user) {
      return createAuthErrorResponse('请先登录');
    }
    
    if (!isHROrAdmin(user)) {
      return createPermissionErrorResponse('只有HR或管理员可以删除职位');
    }
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids)) {
      return NextResponse.json(
        {
          success: false,
          error: '参数错误',
          message: '请提供有效的职位ID列表'
        },
        { status: 400 }
      );
    }

    const deletedJobs = [];
    for (const id of ids) {
      const existingJob = await db.getJobById(id);
      if (existingJob) {
        const success = await db.deleteJob(id);
        if (success) {
          deletedJobs.push(existingJob);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: deletedJobs,
      message: `成功删除 ${deletedJobs.length} 个职位`
    });
  } catch (error) {
    console.error('批量删除职位失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量删除职位失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}