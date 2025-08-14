import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// 邮件配置接口
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// 邮件发送选项
interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
}

// 创建邮件传输器
function createTransporter(): nodemailer.Transporter {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransport(config);
}

// 发送邮件
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Spaceplus Worldwide'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// 邮件模板类型
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

// 生成联系表单通知邮件
export function generateContactNotificationEmail(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
}): EmailTemplate {
  const subject = `新的联系表单提交 - ${data.name}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        新的联系表单提交
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">联系信息</h3>
        <p><strong>姓名:</strong> ${data.name}</p>
        <p><strong>邮箱:</strong> ${data.email}</p>
        ${data.phone ? `<p><strong>电话:</strong> ${data.phone}</p>` : ''}
        <p><strong>来源:</strong> ${data.source}</p>
      </div>
      
      <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
        <h3 style="color: #333; margin-top: 0;">留言内容</h3>
        <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
        <p>此邮件由 Spaceplus Worldwide 官网自动发送</p>
        <p>提交时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>
    </div>
  `;
  
  const text = `
新的联系表单提交

联系信息:
姓名: ${data.name}
邮箱: ${data.email}
${data.phone ? `电话: ${data.phone}\n` : ''}来源: ${data.source}

留言内容:
${data.message}

提交时间: ${new Date().toLocaleString('zh-CN')}
  `;
  
  return { subject, html, text };
}

// 生成职位申请通知邮件
export function generateJobApplicationEmail(data: {
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  coverLetter?: string;
  resumeUrl?: string;
}): EmailTemplate {
  const subject = `新的职位申请 - ${data.jobTitle} - ${data.applicantName}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
        新的职位申请
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #28a745; margin-top: 0;">职位信息</h3>
        <p><strong>职位:</strong> ${data.jobTitle}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #28a745; margin-top: 0;">申请人信息</h3>
        <p><strong>姓名:</strong> ${data.applicantName}</p>
        <p><strong>邮箱:</strong> ${data.applicantEmail}</p>
        <p><strong>电话:</strong> ${data.applicantPhone}</p>
        ${data.resumeUrl ? `<p><strong>简历:</strong> <a href="${data.resumeUrl}">查看简历</a></p>` : ''}
      </div>
      
      ${data.coverLetter ? `
        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">求职信</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${data.coverLetter}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
        <p>此邮件由 Spaceplus Worldwide 招聘系统自动发送</p>
        <p>申请时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>
    </div>
  `;
  
  const text = `
新的职位申请

职位信息:
职位: ${data.jobTitle}

申请人信息:
姓名: ${data.applicantName}
邮箱: ${data.applicantEmail}
电话: ${data.applicantPhone}
${data.resumeUrl ? `简历: ${data.resumeUrl}\n` : ''}
${data.coverLetter ? `\n求职信:\n${data.coverLetter}\n` : ''}
申请时间: ${new Date().toLocaleString('zh-CN')}
  `;
  
  return { subject, html, text };
}

// 生成申请状态更新邮件
export function generateApplicationStatusEmail(data: {
  applicantName: string;
  jobTitle: string;
  status: string;
  notes?: string;
}): EmailTemplate {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    reviewing: '审核中',
    interview: '面试邀请',
    rejected: '未通过',
    accepted: '录用通知'
  };
  
  const statusText = statusMap[data.status] || data.status;
  const subject = `申请状态更新 - ${data.jobTitle} - ${statusText}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
        申请状态更新
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p>亲爱的 ${data.applicantName}，</p>
        <p>您申请的职位 <strong>${data.jobTitle}</strong> 状态已更新为：<strong style="color: #007bff;">${statusText}</strong></p>
      </div>
      
      ${data.notes ? `
        <div style="background: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
          <h3 style="color: #333; margin-top: 0;">备注信息</h3>
          <p style="line-height: 1.6; white-space: pre-wrap;">${data.notes}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 20px; padding: 15px; background: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
        <p>感谢您对 Spaceplus Worldwide 的关注</p>
        <p>如有疑问，请联系我们的HR团队</p>
      </div>
    </div>
  `;
  
  const text = `
申请状态更新

亲爱的 ${data.applicantName}，

您申请的职位 ${data.jobTitle} 状态已更新为：${statusText}

${data.notes ? `备注信息:\n${data.notes}\n\n` : ''}感谢您对 Spaceplus Worldwide 的关注
如有疑问，请联系我们的HR团队
  `;
  
  return { subject, html, text };
}

// 生成新闻订阅邮件
export function generateNewsletterEmail(data: {
  subscriberName?: string;
  news: Array<{
    title: string;
    excerpt: string;
    slug: string;
    image?: string;
    publishedAt: string;
  }>;
}): EmailTemplate {
  const subject = 'Spaceplus Worldwide 最新资讯';
  
  const newsItems = data.news.map(item => `
    <div style="border-bottom: 1px solid #eee; padding: 20px 0;">
      ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; max-width: 200px; height: auto; border-radius: 5px; margin-bottom: 10px;">` : ''}
      <h3 style="color: #007bff; margin: 10px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/news/${item.slug}" style="color: #007bff; text-decoration: none;">
          ${item.title}
        </a>
      </h3>
      <p style="color: #666; line-height: 1.6; margin: 10px 0;">${item.excerpt}</p>
      <p style="font-size: 12px; color: #999;">${new Date(item.publishedAt).toLocaleDateString('zh-CN')}</p>
    </div>
  `).join('');
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Spaceplus Worldwide</h1>
        <p style="margin: 10px 0 0 0;">最新资讯</p>
      </div>
      
      <div style="padding: 20px;">
        ${data.subscriberName ? `<p>亲爱的 ${data.subscriberName}，</p>` : '<p>您好，</p>'}
        <p>以下是我们为您精选的最新资讯：</p>
        
        ${newsItems}
        
        <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; text-align: center;">
          <p style="margin: 0;">访问我们的网站了解更多</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            访问官网
          </a>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
        <p>此邮件由 Spaceplus Worldwide 发送</p>
        <p>如不想再收到此类邮件，请联系我们取消订阅</p>
      </div>
    </div>
  `;
  
  const text = `
Spaceplus Worldwide 最新资讯

${data.subscriberName ? `亲爱的 ${data.subscriberName}，` : '您好，'}

以下是我们为您精选的最新资讯：

${data.news.map(item => `${item.title}\n${item.excerpt}\n发布时间: ${new Date(item.publishedAt).toLocaleDateString('zh-CN')}\n查看详情: ${process.env.NEXT_PUBLIC_BASE_URL}/news/${item.slug}\n`).join('\n')}

访问我们的网站了解更多: ${process.env.NEXT_PUBLIC_BASE_URL}

此邮件由 Spaceplus Worldwide 发送
如不想再收到此类邮件，请联系我们取消订阅
  `;
  
  return { subject, html, text };
}

/**
 * 生成新闻订阅邮件模板
 */
export function generateNewsletterSubscriptionEmail(data: {
  name: string;
  email: string;
  subscriptionId: string;
}): string {
  const unsubscribeToken = Buffer.from(
    `${data.email}:${process.env.JWT_SECRET || 'default-secret'}`
  ).toString('base64');
  
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter?email=${encodeURIComponent(data.email)}&token=${unsubscribeToken}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #333; margin: 0;">欢迎订阅 SpacePlus</h1>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">感谢您的订阅！</h2>
        <p style="color: #666; line-height: 1.6;">亲爱的 ${data.name}，</p>
        <p style="color: #666; line-height: 1.6;">
          感谢您订阅 SpacePlus 的新闻邮件！我们将定期为您发送最新的行业资讯、案例分享和公司动态。
        </p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #333;">您将收到：</h3>
        <ul style="color: #666; line-height: 1.8;">
          <li>最新的行业趋势和洞察</li>
          <li>成功案例分享</li>
          <li>公司新闻和活动信息</li>
          <li>专业建议和最佳实践</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" 
           style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          访问我们的网站
        </a>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
        <p style="color: #999; font-size: 12px; margin: 0;">
          如果您不想再收到这些邮件，可以 
          <a href="${unsubscribeUrl}" style="color: #007bff;">取消订阅</a>
        </p>
        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
          SpacePlus Worldwide | 专业的夜生活和娱乐场所咨询服务
        </p>
      </div>
    </div>
  `;
}

/**
 * 生成职位申请通知邮件
 */
export function generateJobApplicationNotificationEmail(data: {
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone?: string;
  resumeUrl?: string;
  coverLetter?: string;
}): string {
  const { jobTitle, applicantName, applicantEmail, applicantPhone, resumeUrl, coverLetter } = data;
  
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">新的职位申请</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">有新的候选人申请了职位</p>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
          <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">职位信息</h2>
          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #007bff;">${jobTitle}</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">申请人信息</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6c757d; width: 120px;">姓名：</td>
              <td style="padding: 8px 0;">${applicantName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">邮箱：</td>
              <td style="padding: 8px 0;"><a href="mailto:${applicantEmail}" style="color: #007bff;">${applicantEmail}</a></td>
            </tr>
            ${applicantPhone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">电话：</td>
              <td style="padding: 8px 0;">${applicantPhone}</td>
            </tr>
            ` : ''}
            ${resumeUrl ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">简历：</td>
              <td style="padding: 8px 0;"><a href="${resumeUrl}" style="color: #007bff;">查看简历</a></td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        ${coverLetter ? `
        <div style="margin-bottom: 25px;">
          <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">求职信</h3>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #007bff;">
            <p style="margin: 0; white-space: pre-wrap;">${coverLetter}</p>
          </div>
        </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/jobs" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            查看所有申请
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            此邮件由 SpacePlus Worldwide 招聘系统自动发送
          </p>
        </div>
      </div>
    </div>
  `;
}