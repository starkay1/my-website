# 🚀 GitHub Secrets 快速配置指南

## 📋 立即开始

### 第一步：访问 GitHub Secrets 设置

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

### 第二步：配置必需的 Secrets

> 💡 **提示**: 使用刚才生成的 `github-secrets-*.txt` 文件中的值

#### 🔐 认证密钥 (必需)

```
名称: JWT_SECRET
值: lgynT91UvbZfgJqzyAvYiTYX5y2k9upnef2HiiZnm7c=
```

```
名称: NEXTAUTH_SECRET
值: zQHu3AYYPcXp2QdIzQMqFDqRghvfs9/mr3dle+MiiqA=
```

#### 🗄️ 数据库配置 (必需)

```
名称: DATABASE_URL
值: postgresql://spaceplus:8b38fd2c9429edf7a65f9338c504af4d@localhost:5432/spaceplus_prod
```

```
名称: POSTGRES_DB
值: spaceplus_prod
```

```
名称: POSTGRES_USER
值: spaceplus
```

```
名称: POSTGRES_PASSWORD
值: 8b38fd2c9429edf7a65f9338c504af4d
```

#### 📧 邮件服务 (必需 - 需要手动配置)

**Gmail 配置示例:**

```
名称: SMTP_HOST
值: smtp.gmail.com
```

```
名称: SMTP_PORT
值: 587
```

```
名称: SMTP_USER
值: your-email@gmail.com  # 替换为你的邮箱
```

```
名称: SMTP_PASS
值: your-app-password     # 替换为应用专用密码
```

```
名称: SMTP_FROM
值: noreply@spaceplusworldwide.club
```

```
名称: SMTP_FROM_NAME
值: SpacePlus Worldwide
```

> 📧 **Gmail 应用专用密码设置**:
> 1. 访问 [Google 账户设置](https://myaccount.google.com/)
> 2. 安全 → 两步验证 → 应用专用密码
> 3. 生成新的应用专用密码
> 4. 使用生成的密码作为 `SMTP_PASS`

#### 🔗 Google OAuth (必需)

**获取 Google OAuth 凭据:**

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 设置授权重定向 URI: `https://spaceplusworldwide.club/api/auth/callback/google`

```
名称: GOOGLE_CLIENT_ID
值: your-google-client-id.apps.googleusercontent.com
```

```
名称: GOOGLE_CLIENT_SECRET
值: your-google-client-secret
```

#### 🐛 Sentry 错误监控 (推荐)

**获取 Sentry DSN:**

1. 访问 [Sentry.io](https://sentry.io/)
2. 创建新项目 (选择 Next.js)
3. 复制 DSN 地址

```
名称: SENTRY_DSN
值: https://your-dsn@sentry.io/project-id
```

```
名称: NEXT_PUBLIC_SENTRY_DSN
值: https://your-public-dsn@sentry.io/project-id
```

### 第三步：可选配置

#### 📊 Google Analytics (推荐)

```
名称: NEXT_PUBLIC_GA_ID
值: G-XXXXXXXXXX  # 从 Google Analytics 获取
```

#### 🗃️ Redis 缓存 (可选)

```
名称: REDIS_URL
值: redis://localhost:6379
```

```
名称: REDIS_PASSWORD
值: 3f98e00411d5047a701fa0aeb09d212d
```

#### 📬 通知邮箱 (可选)

```
名称: NOTIFICATION_EMAIL
值: notifications@spaceplusworldwide.club
```

```
名称: HR_EMAIL
值: hr@spaceplusworldwide.club
```

```
名称: SUPPORT_EMAIL
值: support@spaceplusworldwide.club
```

## ✅ 配置验证

### 最小配置检查清单

完成以下配置后即可进行部署:

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
- [ ] SMTP_FROM
- [ ] SMTP_FROM_NAME
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET

### 推荐配置 (增强功能)

- [ ] SENTRY_DSN
- [ ] NEXT_PUBLIC_SENTRY_DSN
- [ ] NEXT_PUBLIC_GA_ID
- [ ] REDIS_URL
- [ ] REDIS_PASSWORD

## 🚀 部署测试

配置完成后，推送代码触发部署:

```bash
git add .
git commit -m "feat: 配置 GitHub Secrets"
git push origin main
```

然后访问 GitHub Actions 页面监控部署状态。

## 🔒 安全提醒

- ✅ 已生成强随机密钥
- ⚠️ 请妥善保管生成的配置文件
- ⚠️ 配置完成后删除本地 `github-secrets-*.txt` 文件
- ⚠️ 不要将密钥提交到代码仓库
- ⚠️ 定期更换密钥 (建议每90天)

## 📞 需要帮助？

如遇问题，请查看:
- 📖 [详细配置文档](./GITHUB_SECRETS_CONFIGURATION.md)
- 🔧 [部署指南](./DEPLOYMENT_GUIDE.md)
- 🐛 GitHub Actions 日志
- 📊 Sentry 错误报告

---

**配置完成后，你的 SpacePlus 项目就可以成功部署到 GitHub Pages 了！** 🎉