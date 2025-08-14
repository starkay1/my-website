import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/database';

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



interface RouteParams {
  params: {
    id: string;
  };
}

// GET - 获取单个职位
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const job = await db.getJobById(id);

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: '职位不存在',
          message: '未找到指定的职位信息'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('获取职位详情失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取职位详情失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// PUT - 更新职位
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    // 转换数据格式以匹配数据库模式
    const updateData = {
      ...validatedData,
      salary: validatedData.salary ? JSON.stringify(validatedData.salary) : undefined,
      deadline: validatedData.deadline ? validatedData.deadline : undefined
    };

    const updatedJob = await db.updateJob(id, updateData);
    
    if (!updatedJob) {
      return NextResponse.json(
        {
          success: false,
          error: '职位不存在',
          message: '未找到指定的职位信息'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: '职位更新成功'
    });
  } catch (error) {
    console.error('更新职位失败:', error);
    
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
        error: '更新职位失败',
        message: '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

// DELETE - 删除职位
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const success = await db.deleteJob(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '职位不存在',
          message: '未找到指定的职位信息'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '职位删除成功'
    });
  } catch (error) {
    console.error('删除职位失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除职位失败',
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}