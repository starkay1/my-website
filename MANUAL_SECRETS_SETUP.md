# 🔐 手动 GitHub Secrets 配置指南

本指南帮助你完成 SpacePlus 项目中需要手动配置的 GitHub Secrets。

## 📋 配置清单

### ✅ 已自动配置的 Secrets
- JWT_SECRET
- NEXTAUTH_SECRET
- POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
- DATABASE_URL
- REDIS_PASSWORD, REDIS_URL
- NODE_ENV, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL, GITHUB_PAGES

### ⏳ 需要手动配置的 Secrets

## 1. 📧 Gmail SMTP 配置 (必需)

### 获取 Gmail 应用专用密码
1. 登录 [Google 账户设置](https://myaccount.google.com/)
2. 点击「安全性」→「两步验证」(必须先启用)
3. 点击「应用专用密码」
4. 选择「邮件」和「其他设备」
5. 输入「SpacePlus」作为应用名称
6. 复制生成的 16 位密码

### 在 GitHub 中配置
```bash
# 方法1: 使用 GitHub CLI
gh secret set SMTP_PASSWORD --body "your-16-digit-password"

# 方法2: 在 GitHub 网页端
# 仓库 → Settings → Secrets and variables → Actions → New repository secret
# Name: SMTP_PASSWORD
# Secret: your-16-digit-password
```

## 2. 🔗 Google OAuth 配置 (必需)

### 创建 Google OAuth 应用
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用「Google+ API」和「People API」
4. 转到「凭据」→「创建凭据」→「OAuth 2.0 客户端 ID」
5. 应用类型选择「Web 应用程序」
6. 添加授权重定向 URI：
   - `https://spaceplusworldwide.club/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (开发环境)

### 在 GitHub 中配置
```bash
# 客户端 ID
gh secret set GOOGLE_CLIENT_ID --body "your-client-id.googleusercontent.com"

# 客户端密钥
gh secret set GOOGLE_CLIENT_SECRET --body "your-client-secret"
```

## 3. 🐛 Sentry 错误监控 (推荐)

### 创建 Sentry 项目
1. 注册 [Sentry 账户](https://sentry.io/)
2. 创建新项目，选择「Next.js」
3. 复制项目的 DSN

### 在 GitHub 中配置
```bash
gh secret set SENTRY_DSN --body "https://your-dsn@sentry.io/project-id"
```

## 4. 📊 Google Analytics (推荐)

### 创建 GA4 属性
1. 访问 [Google Analytics](https://analytics.google.com/)
2. 创建新属性
3. 复制「衡量 ID」(格式: G-XXXXXXXXXX)

### 在 GitHub 中配置
```bash
gh secret set NEXT_PUBLIC_GA_ID --body "G-XXXXXXXXXX"
```

## 5. 📬 通知邮箱 (可选)

### 配置系统通知邮箱
```bash
gh secret set NOTIFICATION_EMAIL --body "admin@spaceplusworldwide.club"
```

## 🚀 快速配置脚本

运行自动配置脚本：
```bash
# 给脚本执行权限
chmod +x scripts/setup-github-secrets.sh

# 运行配置脚本
./scripts/setup-github-secrets.sh
```

## ✅ 配置验证

### 检查已配置的 Secrets
```bash
gh secret list
```

### 最小配置清单 (必需)
- [x] JWT_SECRET
- [x] NEXTAUTH_SECRET
- [x] DATABASE_URL
- [x] REDIS_URL
- [ ] SMTP_PASSWORD
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET

### 完整配置清单 (推荐)
- [x] 基础认证和数据库
- [ ] SMTP 邮件服务
- [ ] Google OAuth 登录
- [ ] Sentry 错误监控
- [ ] Google Analytics
- [ ] 通知邮箱

## 🔒 安全提醒

1. **定期更换密钥** - 建议每 90 天更换一次
2. **最小权限原则** - 只配置必需的 Secrets
3. **监控访问日志** - 定期检查 Secrets 使用情况
4. **备份恢复计划** - 保存密钥的安全备份

## 🐛 故障排除

### GitHub CLI 问题
```bash
# 重新登录
gh auth logout
gh auth login

# 检查权限
gh auth status
```

### Secret 配置失败
1. 检查 Secret 名称是否正确
2. 确认仓库权限
3. 验证 Secret 值格式

### 部署失败
1. 检查 GitHub Actions 日志
2. 验证必需的 Secrets 是否配置
3. 确认第三方服务配置正确

## 📞 获取帮助

- 查看 GitHub Actions 运行日志
- 检查 `DEPLOYMENT_GUIDE.md` 文档
- 参考 `QUICK_SECRETS_SETUP.md` 快速指南

---

配置完成后，推送代码即可触发自动部署！

```bash
git add .
git commit -m "feat: 完成 GitHub Secrets 配置"
git push origin main
```