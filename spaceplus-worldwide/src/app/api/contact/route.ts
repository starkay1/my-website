import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, requirements } = await request.json();

    // 验证必填字段
    if (!name || !email || !phone || !requirements) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // 邮件内容
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.GMAIL_USER,
      subject: `SpacePlus Worldwide - 新的咨询请求来自 ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            SpacePlus Worldwide - 新的咨询请求
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">客户信息</h3>
            <p><strong>姓名:</strong> ${name}</p>
            <p><strong>邮箱:</strong> ${email}</p>
            <p><strong>电话:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">需求描述</h3>
            <p style="white-space: pre-wrap;">${requirements}</p>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>提醒:</strong> 请尽快联系客户，确保及时响应咨询需求。
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            此邮件由 SpacePlus Worldwide 官网自动发送<br>
            发送时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
          </p>
        </div>
      `,
    };

    // 发送邮件
    await transporter.sendMail(mailOptions);

    // 发送确认邮件给客户
    const confirmationMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'SpacePlus Worldwide - 咨询确认',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            感谢您的咨询！
          </h2>
          
          <p>尊敬的 ${name}，</p>
          
          <p>感谢您对 SpacePlus Worldwide 的关注和信任。我们已收到您的咨询请求，我们的专业团队将在 24 小时内与您取得联系。</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">您的咨询信息</h3>
            <p><strong>联系电话:</strong> ${phone}</p>
            <p><strong>需求描述:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 4px;">${requirements}</p>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">接下来的步骤</h3>
            <ul style="color: #047857;">
              <li>我们的投资顾问将在 24 小时内联系您</li>
              <li>根据您的需求提供定制化投资方案</li>
              <li>安排专业团队进行详细咨询</li>
            </ul>
          </div>
          
          <p>如有紧急事务，请直接致电我们的客服热线。</p>
          
          <p>再次感谢您选择 SpacePlus Worldwide！</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            SpacePlus Worldwide - 全球空间投资专家<br>
            © 2024 SpacePlus Worldwide. 保留所有权利。
          </p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: '咨询请求已成功提交' },
      { status: 200 }
    );
  } catch (error) {
    console.error('邮件发送失败:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}