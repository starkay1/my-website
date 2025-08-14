# GitHub Secrets 配置指南

本文档详细说明了如何在GitHub仓库中配置所有必要的Secrets，以确保SpacePlus项目能够正确部署到GitHub Pages。

## 🔐 必需的GitHub Secrets

### 1. 认证和安全

#### `NEXTAUTH_SECRET`
- **描述**: NextAuth.js的加密密钥
- **生成方法**: 
  ```bash
  openssl rand -base64 32
  ```
- **示例**: `your-super-secret-nextauth-key-here`

#### `JWT_SECRET`
- **描述**: JWT令牌的签名密钥
- **生成方法**: 
  ```bash
  openssl rand -base64 32
  ```
- **示例**: `your-jwt-secret-key-here`

### 2. Google服务配置

#### `NEXT_PUBLIC_GA_ID`
- **描述**: Google Analytics测量ID
- **获取方法**: 在Google Analytics中创建属性
- **格式**: `G-XXXXXXXXXX`
- **示例**: `G-SPACEPLUS2024`

#### `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- **描述**: Google Search Console验证码
- **获取方法**: 在Google Search Console中添加属性
- **示例**: `spaceplus-verification-2024`

#### `NEXT_PUBLIC_OPTIMIZE_ID`
- **描述**: Google Optimize容器ID
- **获取方法**: 在Google Optimize中创建容器
- **格式**: `OPT-XXXXXXX`
- **示例**: `OPT-SPACEPLUS2024`

#### `GOOGLE_CLIENT_ID`
- **描述**: Google OAuth客户端ID
- **获取方法**: 在Google Cloud Console中创建OAuth 2.0客户端
- **格式**: `xxxxxxxxx.apps.googleusercontent.com`

#### `GOOGLE_CLIENT_SECRET`
- **描述**: Google OAuth客户端密钥
- **获取方法**: 在Google Cloud Console中创建OAuth 2.0客户端
- **注意**: 保密，不要泄露

### 3. Sentry错误监控

#### `SENTRY_DSN`
- **描述**: Sentry项目的DSN（服务器端）
- **获取方法**: 在Sentry中创建项目
- **格式**: `https://xxxxxxx@xxxxxxx.ingest.sentry.io/xxxxxxx`

#### `NEXT_PUBLIC_SENTRY_DSN`
- **描述**: Sentry项目的DSN（客户端）
- **获取方法**: 在Sentry中创建项目
- **格式**: `https://xxxxxxx@xxxxxxx.ingest.sentry.io/xxxxxxx`
- **注意**: 通常与SENTRY_DSN相同

### 4. 邮件服务配置

#### `SMTP_HOST`
- **描述**: SMTP服务器地址
- **示例**: `smtp.spaceplusworldwide.club` 或 `smtp.gmail.com`

#### `SMTP_PORT`
- **描述**: SMTP服务器端口
- **常用值**: `587` (TLS) 或 `465` (SSL)

#### `SMTP_USER`
- **描述**: SMTP用户名
- **示例**: `noreply@spaceplusworldwide.club`

#### `SMTP_PASS`
- **描述**: SMTP密码
- **注意**: 如使用Gmail，需要应用专用密码

#### `SMTP_FROM`
- **描述**: 发件人邮箱地址
- **示例**: `noreply@spaceplusworldwide.club`

#### `NOTIFICATION_EMAIL`
- **描述**: 接收通知的邮箱
- **示例**: `admin@spaceplusworldwide.club`

#### `HR_EMAIL`
- **描述**: HR部门邮箱
- **示例**: `hr@spaceplusworldwide.club`

#### `SUPPORT_EMAIL`
- **描述**: 技术支持邮箱
- **示例**: `support@spaceplusworldwide.club`

### 5. 第三方集成

#### `CONTACT_WEBHOOK_URL`
- **描述**: 联系表单Webhook URL
- **示例**: `https://hooks.zapier.com/hooks/catch/spaceplus/contact/`

#### `VERCEL_ANALYTICS_ID`
- **描述**: Vercel Analytics ID（可选）
- **获取方法**: 在Vercel中启用Analytics

## 🛠️ 配置步骤

### 1. 访问GitHub Secrets设置

1. 打开GitHub仓库页面
2. 点击 **Settings** 标签
3. 在左侧菜单中选择 **Secrets and variables** > **Actions**
4. 点击 **New repository secret**

### 2. 添加每个Secret

对于上述每个Secret：
1. 在 **Name** 字段中输入Secret名称（如 `NEXTAUTH_SECRET`）
2. 在 **Secret** 字段中输入对应的值
3. 点击 **Add secret**

### 3. 验证配置

配置完成后，可以在Actions页面查看：
1. 点击 **Actions** 标签
2. 查看最新的工作流运行
3. 确保构建和部署成功

## 🔍 获取各种服务的配置信息

### Google Analytics

1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建新的属性
3. 选择 "网站" 作为平台
4. 输入网站信息：
   - 网站名称: SpacePlus
   - 网站URL: https://spaceplusworldwide.club
   - 行业类别: 商业和工业市场
   - 时区: 选择合适的时区
5. 创建后获取测量ID (G-XXXXXXXXXX)

### Google Search Console

1. 访问 [Google Search Console](https://search.google.com/search-console/)
2. 添加属性: `https://spaceplusworldwide.club`
3. 选择 "HTML标记" 验证方法
4. 复制验证码（content属性的值）

### Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建OAuth 2.0客户端ID：
   - 应用类型: Web应用
   - 授权重定向URI: `https://spaceplusworldwide.club/api/auth/callback/google`
5. 获取客户端ID和客户端密钥

### Sentry

1. 访问 [Sentry](https://sentry.io/)
2. 创建新项目
3. 选择 "Next.js" 作为平台
4. 获取DSN URL

### SMTP配置

#### 使用Gmail
1. 启用2FA
2. 生成应用专用密码
3. 配置：
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: 你的Gmail地址
   - Pass: 应用专用密码

#### 使用自定义域名邮箱
1. 联系域名提供商获取SMTP设置
2. 通常配置：
   - Host: `smtp.yourdomain.com`
   - Port: `587` 或 `465`
   - User: 邮箱地址
   - Pass: 邮箱密码

## ⚠️ 安全注意事项

1. **永远不要**在代码中硬编码敏感信息
2. **定期轮换**密钥和令牌
3. **使用强密码**和复杂的密钥
4. **限制访问权限**，只给必要的人员访问
5. **监控使用情况**，定期检查异常活动
6. **备份重要配置**，但要安全存储

## 🧪 测试配置

配置完成后，可以通过以下方式测试：

1. **触发GitHub Actions**:
   ```bash
   git commit --allow-empty -m "Test deployment"
   git push origin main
   ```

2. **检查构建日志**:
   - 在GitHub Actions页面查看构建过程
   - 确保没有环境变量相关的错误

3. **验证部署**:
   - 访问 https://spaceplusworldwide.club
   - 检查Google Analytics是否正常工作
   - 测试联系表单功能

## 📞 获取帮助

如果在配置过程中遇到问题：

1. 检查GitHub Actions的构建日志
2. 确认所有Secret名称拼写正确
3. 验证Secret值的格式是否正确
4. 查看相关服务的文档
5. 联系技术支持: support@spaceplusworldwide.club

---

**重要提醒**: 配置完成后，请删除或保护好包含敏感信息的临时文件，确保生产环境的安全性。