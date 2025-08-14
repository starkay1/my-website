# GitHub Secrets 配置指南

## 📋 概述

为了确保 SpacePlus 项目在 GitHub Pages 上正常运行，需要在 GitHub 仓库中配置以下 Secrets。这些 Secrets 包含敏感信息，如 API 密钥、数据库连接字符串等。

## 🔧 配置步骤

### 1. 访问 GitHub Secrets 设置

1. 打开 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

### 2. 必需的 Secrets 配置

#### 🔐 认证和安全

**JWT_SECRET**
```
名称: JWT_SECRET
值: [生成一个强随机字符串，至少32字符]
描述: JWT 令牌签名密钥
生成方法: openssl rand -base64 32
```

**NEXTAUTH_SECRET**
```
名称: NEXTAUTH_SECRET
值: [生成一个强随机字符串，至少32字符]
描述: NextAuth.js 会话加密密钥
生成方法: openssl rand -base64 32
```

#### 🗄️ 数据库配置

**DATABASE_URL**
```
名称: DATABASE_URL
值: postgresql://username:password@host:port/database
描述: PostgreSQL 数据库连接字符串
示例: postgresql://spaceplus:your_password@localhost:5432/spaceplus_prod
```

**POSTGRES_DB**
```
名称: POSTGRES_DB
值: spaceplus_prod
描述: PostgreSQL 数据库名称
```

**POSTGRES_USER**
```
名称: POSTGRES_USER
值: spaceplus
描述: PostgreSQL 用户名
```

**POSTGRES_PASSWORD**
```
名称: POSTGRES_PASSWORD
值: [强密码]
描述: PostgreSQL 密码
```

#### 📧 邮件服务配置

**SMTP_HOST**
```
名称: SMTP_HOST
值: smtp.gmail.com (或其他 SMTP 服务器)
描述: SMTP 服务器地址
```

**SMTP_PORT**
```
名称: SMTP_PORT
值: 587
描述: SMTP 端口号
```

**SMTP_USER**
```
名称: SMTP_USER
值: your-email@gmail.com
描述: SMTP 用户名/邮箱
```

**SMTP_PASS**
```
名称: SMTP_PASS
值: [应用专用密码]
描述: SMTP 密码或应用专用密码
```

**SMTP_FROM**
```
名称: SMTP_FROM
值: noreply@spaceplusworldwide.club
描述: 发件人邮箱地址
```

**SMTP_FROM_NAME**
```
名称: SMTP_FROM_NAME
值: SpacePlus Worldwide
描述: 发件人显示名称
```

#### 📬 通知邮箱配置

**NOTIFICATION_EMAIL**
```
名称: NOTIFICATION_EMAIL
值: notifications@spaceplusworldwide.club
描述: 系统通知接收邮箱
```

**HR_EMAIL**
```
名称: HR_EMAIL
值: hr@spaceplusworldwide.club
描述: 人力资源部门邮箱
```

**SUPPORT_EMAIL**
```
名称: SUPPORT_EMAIL
值: support@spaceplusworldwide.club
描述: 技术支持邮箱
```

#### 🔗 第三方服务集成

**GOOGLE_CLIENT_ID**
```
名称: GOOGLE_CLIENT_ID
值: [从 Google Cloud Console 获取]
描述: Google OAuth 客户端 ID
获取方法: https://console.cloud.google.com/apis/credentials
```

**GOOGLE_CLIENT_SECRET**
```
名称: GOOGLE_CLIENT_SECRET
值: [从 Google Cloud Console 获取]
描述: Google OAuth 客户端密钥
```

**SENTRY_DSN**
```
名称: SENTRY_DSN
值: https://your-dsn@sentry.io/project-id
描述: Sentry 错误监控 DSN
获取方法: https://sentry.io/settings/projects/
```

**NEXT_PUBLIC_SENTRY_DSN**
```
名称: NEXT_PUBLIC_SENTRY_DSN
值: https://your-public-dsn@sentry.io/project-id
描述: Sentry 客户端 DSN (公开)
```

#### 📊 分析和监控

**NEXT_PUBLIC_GA_ID**
```
名称: NEXT_PUBLIC_GA_ID
值: G-XXXXXXXXXX
描述: Google Analytics 测量 ID
获取方法: https://analytics.google.com/
```

**VERCEL_ANALYTICS_ID**
```
名称: VERCEL_ANALYTICS_ID
值: [Vercel Analytics ID]
描述: Vercel 分析 ID (可选)
```

**NEXT_PUBLIC_OPTIMIZE_ID**
```
名称: NEXT_PUBLIC_OPTIMIZE_ID
值: GTM-XXXXXXX
描述: Google Optimize ID (可选)
```

#### 🗃️ 缓存和存储

**REDIS_URL**
```
名称: REDIS_URL
值: redis://localhost:6379
描述: Redis 连接 URL
```

**REDIS_PASSWORD**
```
名称: REDIS_PASSWORD
值: [Redis 密码]
描述: Redis 认证密码
```

#### 🌐 其他配置

**CONTACT_WEBHOOK_URL**
```
名称: CONTACT_WEBHOOK_URL
值: https://hooks.slack.com/services/xxx/xxx/xxx
描述: 联系表单 Webhook URL (可选)
```

**NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION**
```
名称: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
值: [Google 站点验证码]
描述: Google Search Console 验证
获取方法: https://search.google.com/search-console
```

## 🔒 安全最佳实践

### 1. 密钥生成

```bash
# 生成强随机密钥
openssl rand -base64 32

# 生成 UUID
uuidgen

# 生成十六进制密钥
openssl rand -hex 32
```

### 2. 密码要求

- 至少 16 个字符
- 包含大小写字母、数字和特殊字符
- 不使用常见词汇或个人信息
- 定期更换 (建议每 90 天)

### 3. 访问控制

- 仅授权人员可访问 Secrets
- 使用最小权限原则
- 定期审核访问权限
- 记录所有访问和修改

## 📝 配置检查清单

### 必需配置 (部署前必须完成)

- [ ] JWT_SECRET
- [ ] NEXTAUTH_SECRET
- [ ] DATABASE_URL
- [ ] POSTGRES_DB
- [ ] POSTGRES_USER
- [ ] POSTGRES_PASSWORD
- [ ] SMTP_HOST
- [ ] SMTP_PORT
- [ ] SMTP_USER
- [ ] SMTP_PASS
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] SENTRY_DSN
- [ ] NEXT_PUBLIC_SENTRY_DSN

### 推荐配置 (增强功能)

- [ ] NEXT_PUBLIC_GA_ID
- [ ] REDIS_URL
- [ ] REDIS_PASSWORD
- [ ] NOTIFICATION_EMAIL
- [ ] HR_EMAIL
- [ ] SUPPORT_EMAIL
- [ ] NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

### 可选配置 (高级功能)

- [ ] VERCEL_ANALYTICS_ID
- [ ] NEXT_PUBLIC_OPTIMIZE_ID
- [ ] CONTACT_WEBHOOK_URL

## 🧪 配置验证

### 1. 本地测试

```bash
# 复制生产环境配置到本地
cp .env.production .env.local

# 启动开发服务器
npm run dev

# 测试关键功能
# - 用户登录
# - 邮件发送
# - 数据库连接
# - 错误监控
```

### 2. 部署后验证

```bash
# 运行部署状态检查
./scripts/check-deployment-status.sh

# 检查 Sentry 错误报告
# 检查 Google Analytics 数据
# 测试联系表单
# 验证用户注册流程
```

## 🚨 故障排除

### 常见问题

**1. 数据库连接失败**
```
错误: connection refused
解决: 检查 DATABASE_URL 格式和数据库服务状态
```

**2. 邮件发送失败**
```
错误: authentication failed
解决: 检查 SMTP 凭据和应用专用密码
```

**3. OAuth 登录失败**
```
错误: invalid client
解决: 检查 Google OAuth 配置和回调 URL
```

**4. Sentry 错误上报失败**
```
错误: invalid DSN
解决: 检查 Sentry DSN 格式和项目权限
```

### 调试命令

```bash
# 检查环境变量
echo $DATABASE_URL

# 测试数据库连接
psql $DATABASE_URL -c "SELECT version();"

# 测试 SMTP 连接
telnet smtp.gmail.com 587

# 验证 SSL 证书
openssl s_client -connect spaceplusworldwide.club:443
```

## 📞 支持联系

如遇配置问题，请：

1. 检查本文档的故障排除部分
2. 查看 GitHub Actions 日志
3. 检查 Sentry 错误报告
4. 联系技术支持团队

---

**配置完成后，请删除此文档中的敏感信息，并确保不要将实际的密钥值提交到代码仓库中。**

**最后更新**: $(date)
**文档版本**: v1.0.0
**维护状态**: ✅ 活跃维护中