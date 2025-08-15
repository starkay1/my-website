# SpacePlus Worldwide 生产环境部署指南

## 🚀 快速部署步骤

### 1. Vercel 部署（推荐）

#### 方法一：通过 Vercel 网站部署
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 导入 GitHub 仓库：`https://github.com/starkay1/my-website`
5. 选择 `spaceplus-worldwide` 目录作为根目录
6. 配置环境变量（见下方）
7. 点击 "Deploy"

#### 方法二：通过 Vercel CLI 部署
```bash
# 1. 登录 Vercel（需要在浏览器中完成认证）
vercel login

# 2. 在项目目录中部署
cd spaceplus-worldwide
vercel

# 3. 按照提示配置项目
# - 选择团队（如果有）
# - 确认项目名称：spaceplus-worldwide
# - 确认项目目录：./
# - 选择框架：Next.js
```

### 2. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

#### 必需的环境变量
```bash
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=SpacePlus Worldwide
NEXT_TELEMETRY_DISABLED=1

# 安全配置
NEXTAUTH_SECRET=your-production-secret-key-min-32-chars
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 可选的环境变量（根据需要配置）
```bash
# Gmail SMTP（联系表单）
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry 错误监控
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=spaceplus-worldwide
SENTRY_AUTH_TOKEN=your-auth-token
```

### 3. 域名配置

#### 使用 Vercel 提供的域名
- 部署完成后，Vercel 会自动分配一个域名
- 格式：`https://spaceplus-worldwide-xxx.vercel.app`

#### 绑定自定义域名
1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的域名（如：`spaceplus.com`）
3. 按照提示配置 DNS 记录
4. 等待 SSL 证书自动配置

### 4. 部署验证

部署完成后，请验证以下功能：

#### ✅ 基础功能检查
- [ ] 网站可以正常访问
- [ ] 中英文切换正常
- [ ] 响应式设计在移动端正常
- [ ] PWA 功能正常（可安装到桌面）
- [ ] 联系表单可以正常提交

#### ✅ 性能检查
- [ ] 页面加载速度 < 3秒
- [ ] Lighthouse 性能评分 > 90
- [ ] Core Web Vitals 指标良好

#### ✅ SEO 检查
- [ ] 页面标题和描述正确
- [ ] 结构化数据正常
- [ ] 站点地图可访问
- [ ] robots.txt 正确

### 5. 监控配置

#### Google Analytics 配置
1. 创建 GA4 属性
2. 获取测量 ID（G-XXXXXXXXXX）
3. 在环境变量中设置 `NEXT_PUBLIC_GA_ID`

#### Sentry 错误监控配置
1. 注册 [sentry.io](https://sentry.io)
2. 创建新项目
3. 获取 DSN 和认证令牌
4. 在环境变量中配置相关参数

### 6. 性能优化

#### 运行性能测试
```bash
# 本地性能测试
npm run lighthouse
npm run perf:analyze

# 生产环境测试
lighthouse https://your-domain.vercel.app --view
```

#### 优化建议
- 启用 Vercel 的 Edge Functions
- 配置适当的缓存策略
- 优化图片资源
- 启用 Gzip 压缩

### 7. 安全配置

项目已包含以下安全配置：
- CSP（内容安全策略）
- HTTPS 强制重定向
- 安全响应头
- XSS 保护
- CSRF 保护

### 8. 备份和回滚

#### 自动备份
- Vercel 自动保存每次部署的版本
- 可以在 Vercel 控制台中查看部署历史

#### 快速回滚
```bash
# 回滚到上一个版本
vercel rollback

# 回滚到指定版本
vercel rollback [deployment-url]
```

### 9. 故障排除

#### 常见问题

**问题：部署失败**
- 检查 `package.json` 中的依赖版本
- 确认 Node.js 版本兼容性
- 查看 Vercel 构建日志

**问题：环境变量不生效**
- 确认变量名称正确
- 重新部署项目
- 检查变量值是否包含特殊字符

**问题：域名无法访问**
- 检查 DNS 配置
- 等待 DNS 传播（最多 48 小时）
- 验证 SSL 证书状态

### 10. 联系支持

如果遇到部署问题，可以：
- 查看 [Vercel 文档](https://vercel.com/docs)
- 联系 Vercel 支持团队
- 查看项目的 GitHub Issues

---

## 🎉 部署完成

恭喜！SpacePlus Worldwide 项目已成功部署到生产环境。

**下一步建议：**
1. 配置监控和分析
2. 设置自动化测试
3. 优化 SEO 设置
4. 准备内容管理系统
5. 规划后续功能开发

**项目链接：**
- 生产环境：`https://your-domain.vercel.app`
- GitHub 仓库：`https://github.com/starkay1/my-website`
- Vercel 控制台：`https://vercel.com/dashboard`