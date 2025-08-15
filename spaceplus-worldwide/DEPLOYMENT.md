# SpacePlus Worldwide 部署指南

## 🚀 部署概览

本项目采用现代化的部署架构：
- **前端**: Vercel (Next.js)
- **数据库**: Supabase (PostgreSQL)
- **监控**: Sentry + Google Analytics
- **邮件**: Gmail SMTP
- **CDN**: Vercel Edge Network

## 📋 部署前准备

### 1. 环境变量配置

复制 `.env.example` 到 `.env.production` 并配置以下变量：

```bash
# 必需配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

### 2. 第三方服务配置

#### Gmail SMTP
1. 启用 2FA
2. 生成应用专用密码
3. 配置 `GMAIL_USER` 和 `GMAIL_PASS`

#### Google Analytics 4
1. 创建 GA4 属性
2. 获取测量 ID (G-XXXXXXXXXX)
3. 配置 `NEXT_PUBLIC_GA_ID`

#### Sentry 错误监控
1. 创建 Sentry 项目
2. 获取 DSN
3. 配置 `SENTRY_DSN`

## 🌐 Vercel 部署

### 方法一：GitHub 集成 (推荐)

1. **推送代码到 GitHub**
```bash
git add .
git commit -m "feat: 完成 SpacePlus Worldwide 招商版开发"
git push origin main
```

2. **连接 Vercel**
- 访问 [vercel.com](https://vercel.com)
- 导入 GitHub 仓库
- 选择 Next.js 框架

3. **配置环境变量**
在 Vercel Dashboard 中添加：
```
NEXT_PUBLIC_SITE_URL
GMAIL_USER
GMAIL_PASS
NEXT_PUBLIC_GA_ID
SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
SENTRY_AUTH_TOKEN
```

4. **部署**
- Vercel 会自动构建和部署
- 每次推送到 main 分支都会触发自动部署

### 方法二：Vercel CLI

1. **安装 Vercel CLI**
```bash
npm i -g vercel
```

2. **登录并部署**
```bash
vercel login
vercel --prod
```

3. **配置环境变量**
```bash
vercel env add NEXT_PUBLIC_SITE_URL
vercel env add GMAIL_USER
vercel env add GMAIL_PASS
# ... 其他变量
```

## 🗄️ 数据库部署 (Supabase)

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 选择地区 (推荐: Singapore)

### 2. 配置数据库

```sql
-- 创建联系表单表
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- 启用 RLS (行级安全)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 创建策略 (仅允许插入)
CREATE POLICY "Allow insert for all users" ON contact_submissions
  FOR INSERT WITH CHECK (true);
```

### 3. 获取连接信息

在 Supabase Dashboard 中获取：
- Project URL
- API Key (anon/public)
- Database URL

### 4. 更新环境变量

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@host:port/postgres
```

## 🔍 SEO 配置

### Google Search Console

1. **验证网站所有权**
- 访问 [Google Search Console](https://search.google.com/search-console)
- 添加属性: `https://your-domain.com`
- 选择 HTML 标签验证方法

2. **添加验证代码**
在 `layout.tsx` 中添加：
```html
<meta name="google-site-verification" content="your-verification-code" />
```

3. **提交站点地图**
```
https://your-domain.com/sitemap.xml
```

### Bing Webmaster Tools

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 添加站点并验证
3. 提交站点地图

## 📊 性能监控

### 1. Lighthouse 测试

```bash
# 本地测试
npm run lighthouse

# 桌面版测试
npm run lighthouse:desktop

# 完整性能测试
npm run perf:test
```

### 2. Core Web Vitals 监控

- **FCP**: < 1.8s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **FID**: < 100ms

### 3. Sentry 性能监控

在 Sentry Dashboard 中监控：
- 错误率
- 性能指标
- 用户会话
- 发布健康度

## 🔒 安全配置

### 1. 环境变量安全

- 使用 Vercel 环境变量存储敏感信息
- 不要在代码中硬编码密钥
- 定期轮换 API 密钥

### 2. 安全头配置

已在 `vercel.json` 中配置：
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 3. HTTPS 强制

Vercel 自动提供 HTTPS，无需额外配置。

## 🚀 部署检查清单

### 部署前
- [ ] 代码测试通过
- [ ] 环境变量配置完成
- [ ] 第三方服务配置完成
- [ ] 性能测试通过 (Lighthouse ≥ 90)
- [ ] 安全检查完成

### 部署后
- [ ] 网站可正常访问
- [ ] 表单提交功能正常
- [ ] Google Analytics 数据收集正常
- [ ] Sentry 错误监控正常
- [ ] PWA 功能正常
- [ ] 多语言切换正常
- [ ] 移动端适配正常

### SEO 配置
- [ ] Google Search Console 验证
- [ ] Bing Webmaster Tools 验证
- [ ] 站点地图提交
- [ ] robots.txt 配置
- [ ] 结构化数据配置

## 🔧 故障排除

### 常见问题

1. **构建失败**
```bash
# 检查依赖
npm install

# 清理缓存
npm run build
```

2. **环境变量未生效**
- 检查变量名拼写
- 确认在 Vercel Dashboard 中配置
- 重新部署项目

3. **邮件发送失败**
- 检查 Gmail 应用密码
- 确认 2FA 已启用
- 检查防火墙设置

4. **性能问题**
```bash
# 分析包大小
npm run perf:analyze

# 运行性能测试
npm run lighthouse
```

### 日志查看

- **Vercel 日志**: Vercel Dashboard > Functions
- **Sentry 日志**: Sentry Dashboard > Issues
- **浏览器日志**: 开发者工具 > Console

## 📞 支持

如遇到部署问题，请检查：
1. [Vercel 文档](https://vercel.com/docs)
2. [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. [Supabase 文档](https://supabase.com/docs)

---

**部署完成后，请及时更新 DNS 记录并配置自定义域名！** 🎉