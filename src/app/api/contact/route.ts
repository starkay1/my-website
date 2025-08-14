import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createContactFormValidator } from '@/lib/validation';
import { sendEmail, generateContactNotificationEmail } from '@/lib/email';
import { db } from '@/lib/database';
import { prisma } from '@/lib/prisma';
import type { ContactFormData, ApiResponse } from '@/types';

// 模拟数据库或外部服务配置
const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'admin@spaceplus.com';

// Rate limiting 简单实现（生产环境建议使用 Redis）
const requestCounts = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15分钟
};

function getRateLimitStatus(ip: string) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  
  if (!record || now - record.lastReset > RATE_LIMIT.windowMs) {
    requestCounts.set(ip, { count: 1, lastReset: now });
    return { isAllowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    return { isAllowed: false, remaining: 0 };
  }
  
  record.count++;
  return { isAllowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

// 发送通知邮件
async function sendNotificationEmail(formData: ContactFormData) {
  try {
    const emailTemplate = generateContactNotificationEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: 'website'
    });
    
    const success = await sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    });
    
    if (success) {
      console.log('✅ 联系表单通知邮件发送成功');
    } else {
      console.error('❌ 联系表单通知邮件发送失败');
    }
    
    return success;
  } catch (error) {
    console.error('发送通知邮件时出错:', error);
    return false;
  }
}

// 发送确认邮件给用户
async function sendConfirmationEmail(formData: ContactFormData) {
  try {
    const subject = '感谢您的联系 - Spaceplus Worldwide';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #007bff; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Spaceplus Worldwide</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>亲爱的 ${formData.name}，</p>
          <p>感谢您联系 Spaceplus Worldwide！我们已收到您的留言，我们的团队将在 24 小时内回复您。</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">您的留言内容：</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
          </div>
          
          <p>如果您有紧急事务，请直接致电我们的客服热线。</p>
          
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; text-align: center;">
            <p style="margin: 0;">了解更多关于我们的服务</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              访问官网
            </a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d;">
          <p>此邮件由 Spaceplus Worldwide 自动发送，请勿回复</p>
        </div>
      </div>
    `;
    
    const text = `
亲爱的 ${formData.name}，

感谢您联系 Spaceplus Worldwide！我们已收到您的留言，我们的团队将在 24 小时内回复您。

您的留言内容：
${formData.message}

如果您有紧急事务，请直接致电我们的客服热线。

了解更多关于我们的服务：${process.env.NEXT_PUBLIC_BASE_URL}

此邮件由 Spaceplus Worldwide 自动发送，请勿回复
    `;
    
    const success = await sendEmail({
      to: formData.email,
      subject,
      html,
      text
    });
    
    if (success) {
      console.log('✅ 用户确认邮件发送成功');
    } else {
      console.error('❌ 用户确认邮件发送失败');
    }
    
    return success;
  } catch (error) {
    console.error('发送确认邮件时出错:', error);
    return false;
  }
}

// 保存联系表单到数据库
async function saveContactForm(formData: ContactFormData) {
  try {
    const contact = await prisma.contact.create({
      data: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        privacyConsent: formData.privacyConsent,
        status: 'new',
        source: 'website'
      }
    });
    
    console.log('✅ 联系表单已保存到数据库:', contact.id);
    return contact;
  } catch (error) {
    console.error('❌ 保存联系表单到数据库失败:', error);
    throw error;
  }
}

// 发送 Webhook 通知（可选）
async function sendWebhookNotification(formData: ContactFormData & { id: string }) {
  if (!WEBHOOK_URL) return;
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SpacePlus-Contact-Form/1.0',
      },
      body: JSON.stringify({
        event: 'contact_form_submitted',
        data: formData,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      console.error('Webhook 发送失败:', response.statusText);
    }
  } catch (error) {
    console.error('Webhook 发送错误:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP（用于速率限制）
    const headersList = headers();
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // 检查速率限制
    const rateLimitStatus = getRateLimitStatus(clientIP);
    if (!rateLimitStatus.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'TOO_MANY_REQUESTS',
          message: '请求过于频繁，请稍后再试',
        } as ApiResponse,
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': (Date.now() + RATE_LIMIT.windowMs).toString(),
          }
        }
      );
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证请求数据
    const validator = createContactFormValidator('zh-CN');
    const validationResult = validator.validate(body);
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: '请检查输入信息',
          data: {
            errors: validationResult.errors,
          },
        } as ApiResponse,
        { status: 400 }
      );
    }

    const formData: ContactFormData = {
      name: body.name?.trim(),
      phone: body.phone?.trim(),
      email: body.email?.trim().toLowerCase(),
      message: body.message?.trim(),
      privacyConsent: Boolean(body.privacyConsent),
    };

    // 额外的业务逻辑验证
    if (!formData.privacyConsent) {
      return NextResponse.json(
        {
          success: false,
          error: 'PRIVACY_CONSENT_REQUIRED',
          message: '请同意隐私政策后继续',
        } as ApiResponse,
        { status: 400 }
      );
    }

    // 保存表单数据
    const contact = await saveContactForm(formData);
    
    // 并行发送邮件通知
    const emailPromises = [
      // 发送管理员通知邮件
      sendNotificationEmail(formData).catch(error => {
        console.error('管理员通知邮件发送失败:', error);
        return false;
      }),
      // 发送用户确认邮件
      sendConfirmationEmail(formData).catch(error => {
        console.error('用户确认邮件发送失败:', error);
        return false;
      })
    ];
    
    // 等待邮件发送完成（不阻塞响应）
    Promise.all(emailPromises).then(results => {
      const [adminEmailSent, confirmationEmailSent] = results;
      console.log(`邮件发送结果 - 管理员通知: ${adminEmailSent ? '成功' : '失败'}, 用户确认: ${confirmationEmailSent ? '成功' : '失败'}`);
    });
    
    // 发送 Webhook 通知
    try {
      await sendWebhookNotification({ ...formData, id: contact.id });
    } catch (error) {
      console.error('Webhook 发送失败:', error);
      // Webhook 发送失败不影响主流程
    }

    // 返回成功响应
    return NextResponse.json(
      {
        success: true,
        data: { id: contact.id },
        message: '表单提交成功，我们会尽快与您联系。确认邮件已发送到您的邮箱。',
      } as ApiResponse<{ id: string }>,
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimitStatus.remaining.toString(),
        }
      }
    );

  } catch (error) {
    console.error('联系表单处理错误:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: '服务器内部错误，请稍后重试',
      } as ApiResponse,
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// 处理其他 HTTP 方法
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: '不支持的请求方法',
    } as ApiResponse,
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: '不支持的请求方法',
    } as ApiResponse,
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      error: 'METHOD_NOT_ALLOWED',
      message: '不支持的请求方法',
    } as ApiResponse,
    { status: 405 }
  );
}