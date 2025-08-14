import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  isUrgent: boolean;
  isRemote: boolean;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  updatedAt: string;
  createdById?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'pending' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'hr' | 'admin';
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

class DatabaseService {
  // User methods
  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Job methods
  async createJob(data: Omit<JobPosition, 'id' | 'createdAt' | 'updatedAt'>) {
    const job = await prisma.job.create({
      data: {
        title: data.title,
        department: data.department,
        type: data.type,
        location: data.location,
        experience: data.experience,
        salary: data.salary,
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        postedAt: data.postedAt,
        deadline: data.deadline,
        isUrgent: data.isUrgent,
        isRemote: data.isRemote,
        status: data.status,
        createdById: data.createdById,
      },
    });

    return this.formatJob(job);
  }

  async getAllJobs() {
    const jobs = await prisma.job.findMany({
      where: {
        status: 'published',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobs.map(job => this.formatJob(job));
  }

  async getAllJobsForAdmin() {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return jobs.map(job => this.formatJob(job));
  }

  async getJobById(id: string) {
    const job = await prisma.job.findUnique({
      where: { id },
    });

    return job ? this.formatJob(job) : null;
  }

  async updateJob(id: string, data: Partial<JobPosition>) {
    const job = await prisma.job.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.department && { department: data.department }),
        ...(data.type && { type: data.type }),
        ...(data.location && { location: data.location }),
        ...(data.experience && { experience: data.experience }),
        ...(data.salary && { salary: data.salary }),
        ...(data.description && { description: data.description }),
        ...(data.requirements && { requirements: data.requirements }),
        ...(data.responsibilities && { responsibilities: data.responsibilities }),
        ...(data.benefits && { benefits: data.benefits }),
        ...(data.deadline && { deadline: data.deadline }),
        ...(data.isUrgent !== undefined && { isUrgent: data.isUrgent }),
        ...(data.isRemote !== undefined && { isRemote: data.isRemote }),
        ...(data.status && { status: data.status }),
      },
    });

    return this.formatJob(job);
  }

  async deleteJob(id: string) {
    try {
      await prisma.job.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Job Application methods
  async createApplication(data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
    const application = await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl,
        status: data.status || 'pending',
        notes: data.notes,
      },
    });

    return application;
  }

  async getApplicationsByJobId(jobId: string) {
    return await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getApplicationById(id: string) {
    return await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateApplicationStatus(id: string, status: string, notes?: string) {
    return await prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        ...(notes && { notes }),
      },
    });
  }

  // File methods
  async createFile(data: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
    uploadedBy?: string;
  }) {
    return await prisma.file.create({
      data,
    });
  }

  async getFileById(id: string) {
    return await prisma.file.findUnique({
      where: { id },
    });
  }

  async deleteFile(id: string) {
    try {
      await prisma.file.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper method to format job data
  private formatJob(job: any): JobPosition {
    return {
      id: job.id,
      title: job.title,
      department: job.department,
      type: job.type,
      location: job.location,
      experience: job.experience || '',
      salary: job.salary || '',
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
      benefits: Array.isArray(job.benefits) ? job.benefits : [],
      postedAt: job.postedAt,
      deadline: job.deadline || '',
      isUrgent: job.isUrgent,
      isRemote: job.isRemote,
      status: job.status,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      createdById: job.createdById,
    };
  }

  // Seed initial data
  async seedInitialData() {
    const jobCount = await prisma.job.count();
    if (jobCount === 0) {
      const initialJobs = [
        {
          title: '高级品牌策略师',
          department: '品牌设计',
          type: 'full-time' as const,
          location: '上海',
          experience: '3-5年',
          salary: '25-35K',
          description: '负责品牌策略制定和执行，具备丰富的品牌管理经验',
          requirements: [
            '本科及以上学历，市场营销或相关专业',
            '3年以上品牌策略或品牌管理经验',
            '具备优秀的策略思维和创意能力',
            '熟悉夜生活行业者优先'
          ],
          responsibilities: [
            '制定品牌发展策略和年度规划',
            '负责品牌定位和差异化策略',
            '协调品牌传播和营销活动',
            '监控品牌表现和市场反馈'
          ],
          benefits: [
            '五险一金',
            '年终奖金',
            '带薪年假',
            '团队建设'
          ],
          postedAt: '2024-01-15',
          deadline: '2024-02-15',
          isUrgent: false,
          isRemote: false,
          status: 'published' as const,
        },
        {
          title: '项目运营经理',
          department: '运营管理',
          type: 'full-time' as const,
          location: '北京',
          experience: '2-4年',
          salary: '20-30K',
          description: '负责项目运营管理，确保项目顺利进行',
          requirements: [
            '本科及以上学历，管理或相关专业',
            '2年以上项目管理经验',
            '具备优秀的沟通协调能力',
            '熟悉项目管理工具'
          ],
          responsibilities: [
            '制定项目运营计划',
            '协调各部门资源',
            '监控项目进度和质量',
            '处理运营中的问题'
          ],
          benefits: [
            '五险一金',
            '绩效奖金',
            '职业发展',
            '团建活动'
          ],
          postedAt: '2024-01-10',
          deadline: '2024-02-10',
          isUrgent: false,
          isRemote: true,
          status: 'published' as const,
        },
        {
          title: '数字营销经理',
          department: '市场营销',
          type: 'full-time' as const,
          location: '广州',
          experience: '3-5年',
          salary: '22-32K',
          description: '负责数字营销策略制定和执行，提升品牌影响力',
          requirements: [
            '市场营销或相关专业背景',
            '3年以上数字营销经验',
            '熟悉各类营销工具和平台',
            '具备数据分析能力'
          ],
          responsibilities: [
            '制定数字营销策略',
            '管理社交媒体账号',
            '执行线上推广活动',
            '分析营销效果数据'
          ],
          benefits: [
            '五险一金',
            '营销预算',
            '培训机会',
            '弹性工作'
          ],
          postedAt: '2024-01-08',
          deadline: '2024-02-08',
          isUrgent: true,
          isRemote: false,
          status: 'published' as const,
        }
      ];

      for (const jobData of initialJobs) {
        await prisma.job.create({
          data: jobData,
        });
      }
    }
  }
}

export const db = new DatabaseService();

// Initialize seed data
db.seedInitialData().catch(console.error);