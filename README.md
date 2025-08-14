# Spaceplus Worldwide 官方网站

全球夜生活品牌管理与孵化平台的官方网站，集成了用户认证、文件管理、职位发布等功能。

## 功能特性

### 🔐 用户认证与权限管理
- 用户注册、登录、注销功能
- 角色权限控制（管理员、HR、普通用户）
- JWT Token 认证
- 受保护的API路由

### 📁 文件上传与管理
- 支持简历文件上传（PDF、DOC格式）
- 支持图片文件上传（JPG、PNG、WebP、GIF格式）
- 文件预览功能
- 文件下载功能
- 文件权限控制

### 💼 职位管理
- 职位发布与管理
- 职位申请功能
- 简历上传与管理

### 🗄️ 数据库集成
- PostgreSQL 数据库
- Prisma ORM
- 数据持久化
- 自动数据迁移

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, Node.js
- **数据库**: PostgreSQL, Prisma ORM
- **认证**: JWT, bcryptjs
- **文件上传**: Multer
- **UI组件**: Lucide React Icons, 自定义组件

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 12+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd spaceplus
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **环境配置**
   
   复制 `.env.example` 到 `.env` 并配置环境变量：
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件：
   ```env
   # 数据库连接
   DATABASE_URL="postgresql://username:password@localhost:5432/spaceplus_db"
   
   # JWT密钥
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

4. **数据库设置**
   
   生成 Prisma 客户端：
   ```bash
   npm run db:generate
   ```
   
   推送数据库架构：
   ```bash
   npm run db:push
   ```
   
   初始化数据库数据：
   ```bash
   npm run db:seed
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   访问 [http://localhost:3000](http://localhost:3000)

## 数据库管理

### 常用命令

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送架构到数据库
npm run db:push

# 创建和运行迁移
npm run db:migrate

# 打开 Prisma Studio（数据库可视化工具）
npm run db:studio

# 初始化数据库数据
npm run db:seed

# 重置数据库（危险操作）
npm run db:reset
```

### 默认账号

初始化数据库后，可以使用以下账号登录：

- **管理员**: `admin@spaceplus.com` / `admin123`
- **HR**: `hr@spaceplus.com` / `hr123`
- **普通用户**: `user@example.com` / `user123`

## 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证相关API
│   │   ├── files/         # 文件管理API
│   │   └── jobs/          # 职位管理API
│   ├── dashboard/         # 用户仪表板
│   ├── files/            # 文件管理页面
│   └── login/            # 登录页面
├── components/            # React 组件
│   ├── auth/             # 认证相关组件
│   └── ui/               # UI 组件
├── lib/                  # 工具库
│   ├── auth.ts           # 认证工具
│   ├── database.ts       # 数据库服务
│   ├── prisma.ts         # Prisma 客户端
│   └── upload.ts         # 文件上传工具
└── middleware.ts         # Next.js 中间件

prisma/
├── schema.prisma         # 数据库架构
└── migrations/           # 数据库迁移文件

scripts/
└── init-db.ts           # 数据库初始化脚本

public/
└── uploads/             # 上传文件存储目录
```

## API 文档

### 认证 API

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 文件管理 API

- `POST /api/files/upload` - 文件上传
- `GET /api/files` - 获取文件列表
- `GET /api/files/[id]/download` - 文件下载
- `GET /api/files/[id]/preview` - 文件预览
- `DELETE /api/files/[id]` - 删除文件

### 职位管理 API

- `GET /api/jobs` - 获取职位列表
- `POST /api/jobs` - 创建职位
- `GET /api/jobs/[id]` - 获取职位详情
- `PUT /api/jobs/[id]` - 更新职位
- `DELETE /api/jobs/[id]` - 删除职位

## 部署

### 生产环境部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **设置生产环境变量**
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   ```

3. **运行数据库迁移**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **启动生产服务器**
   ```bash
   npm start
   ```

## 开发指南

### 添加新的API路由

1. 在 `src/app/api/` 目录下创建新的路由文件
2. 使用 `authenticateRequest` 进行用户认证
3. 使用 `hasRole` 进行权限检查
4. 使用 `db` 服务进行数据库操作

### 添加新的页面

1. 在 `src/app/` 目录下创建新的页面文件
2. 使用 `ProtectedRoute` 组件保护需要认证的页面
3. 使用 `useAuth` Hook 获取用户信息

### 文件上传

1. 使用 `FileUpload` 组件进行文件上传
2. 文件会自动保存到 `public/uploads/` 目录
3. 文件信息会保存到数据库

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 PostgreSQL 服务是否运行
   - 验证 `DATABASE_URL` 配置是否正确

2. **文件上传失败**
   - 检查 `public/uploads/` 目录是否存在且有写权限
   - 验证文件大小和类型是否符合限制

3. **认证失败**
   - 检查 `JWT_SECRET` 是否配置
   - 验证 Token 是否过期

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。