# SpacePlus 部署指南

本文档详细说明了如何将 SpacePlus 应用部署到生产环境。

## 目录

- [环境要求](#环境要求)
- [部署前准备](#部署前准备)
- [Docker 部署](#docker-部署)
- [手动部署](#手动部署)
- [环境配置](#环境配置)
- [数据库设置](#数据库设置)
- [SSL 证书配置](#ssl-证书配置)
- [监控和日志](#监控和日志)
- [备份策略](#备份策略)
- [故障排除](#故障排除)

## 环境要求

### 最低系统要求

- **操作系统**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **CPU**: 2 核心
- **内存**: 4GB RAM
- **存储**: 20GB 可用空间
- **网络**: 稳定的互联网连接

### 软件依赖

- Docker 20.10+
- Docker Compose 2.0+
- Git 2.30+
- Node.js 18+ (手动部署时需要)
- PostgreSQL 15+ (手动部署时需要)

## 部署前准备

### 1. 克隆代码库

```bash
git clone https://github.com/your-username/spaceplus.git
cd spaceplus
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.production

# 编辑生产环境配置
nano .env.production
```

**重要配置项**:

```env
# 数据库连接
DATABASE_URL="postgresql://spaceplus:your-strong-password@postgres:5432/spaceplus"

# JWT 密钥（必须更改）
JWT_SECRET="your-super-secure-jwt-secret-key"

# 应用 URL
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# 邮件服务
SMTP_HOST="your-smtp-server"
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-email-password"
```

### 3. 设置域名和 DNS

确保您的域名 A 记录指向服务器 IP 地址：

```
your-domain.com.    A    YOUR_SERVER_IP
www.your-domain.com. CNAME your-domain.com.
```

## Docker 部署

### 快速部署

```bash
# 使用部署脚本
chmod +x deploy.sh
./deploy.sh production
```

### 手动 Docker 部署

```bash
# 1. 构建镜像
docker-compose build --no-cache

# 2. 启动服务
docker-compose up -d

# 3. 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 4. 创建管理员用户（可选）
docker-compose exec app npm run seed:admin
```

### 验证部署

```bash
# 检查服务状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 健康检查
curl http://localhost/health
```

## 手动部署

### 1. 安装 Node.js 依赖

```bash
npm ci --production
```

### 2. 构建应用

```bash
npm run build
```

### 3. 设置数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate deploy
```

### 4. 启动应用

```bash
# 使用 PM2 管理进程
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

### PM2 配置文件 (ecosystem.config.js)

```javascript
module.exports = {
  apps: [{
    name: 'spaceplus',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## 环境配置

### 生产环境变量

创建 `.env.production` 文件：

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/spaceplus
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_BASE_URL=https://your-domain.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASS=your-smtp-password
```

### Nginx 配置

创建 `/etc/nginx/sites-available/spaceplus`：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/spaceplus/uploads/;
        expires 1M;
        add_header Cache-Control "public";
    }
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/spaceplus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 数据库设置

### PostgreSQL 安装和配置

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# 创建数据库和用户
sudo -u postgres psql
```

```sql
CREATE DATABASE spaceplus;
CREATE USER spaceplus WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE spaceplus TO spaceplus;
\q
```

### 数据库优化

编辑 `/etc/postgresql/15/main/postgresql.conf`：

```conf
# 内存设置
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# 连接设置
max_connections = 100

# 日志设置
log_statement = 'all'
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

重启 PostgreSQL：

```bash
sudo systemctl restart postgresql
```

## SSL 证书配置

### 使用 Let's Encrypt

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
0 12 * * * /usr/bin/certbot renew --quiet
```

### 手动证书配置

如果使用自己的证书，将证书文件放置在：

```
/etc/nginx/ssl/cert.pem
/etc/nginx/ssl/key.pem
```

## 监控和日志

### 应用监控

```bash
# 使用 PM2 监控
pm2 monit

# 查看应用状态
pm2 status

# 查看日志
pm2 logs spaceplus
```

### 系统监控

安装监控工具：

```bash
# 安装 htop 和 iotop
sudo apt install htop iotop

# 监控系统资源
htop
iotop
```

### 日志管理

配置日志轮转 `/etc/logrotate.d/spaceplus`：

```
/var/log/spaceplus/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reload spaceplus
    endscript
}
```

## 备份策略

### 数据库备份

创建备份脚本 `/usr/local/bin/backup-spaceplus.sh`：

```bash
#!/bin/bash

BACKUP_DIR="/var/backups/spaceplus"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/spaceplus_$DATE.sql"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
pg_dump -h localhost -U spaceplus -d spaceplus > $BACKUP_FILE

# 压缩备份文件
gzip $BACKUP_FILE

# 删除30天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "备份完成: $BACKUP_FILE.gz"
```

设置定时备份：

```bash
# 添加到 crontab
sudo crontab -e
# 每天凌晨2点备份
0 2 * * * /usr/local/bin/backup-spaceplus.sh
```

### 文件备份

```bash
# 备份上传文件
tar -czf /var/backups/spaceplus/uploads_$(date +%Y%m%d).tar.gz /var/www/spaceplus/uploads/
```

## 故障排除

### 常见问题

#### 1. 应用无法启动

```bash
# 检查日志
docker-compose logs app
# 或
pm2 logs spaceplus

# 检查环境变量
env | grep -E "DATABASE_URL|JWT_SECRET"
```

#### 2. 数据库连接失败

```bash
# 测试数据库连接
psql $DATABASE_URL

# 检查 PostgreSQL 状态
sudo systemctl status postgresql
```

#### 3. 内存不足

```bash
# 检查内存使用
free -h

# 添加交换空间
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### 4. 磁盘空间不足

```bash
# 检查磁盘使用
df -h

# 清理 Docker 镜像
docker system prune -a

# 清理日志文件
sudo journalctl --vacuum-time=7d
```

### 性能优化

#### 1. 数据库优化

```sql
-- 创建索引
CREATE INDEX CONCURRENTLY idx_jobs_status ON jobs(status);
CREATE INDEX CONCURRENTLY idx_applications_job_id ON applications(job_id);

-- 分析表统计信息
ANALYZE;
```

#### 2. 应用优化

```bash
# 启用 Node.js 集群模式
pm2 start ecosystem.config.js --env production -i max

# 配置 Redis 缓存
# 在 .env 中添加：
REDIS_URL=redis://localhost:6379
```

### 安全检查清单

- [ ] 更改所有默认密码
- [ ] 配置防火墙规则
- [ ] 启用 SSL/TLS
- [ ] 设置定期备份
- [ ] 配置监控和告警
- [ ] 更新系统和依赖包
- [ ] 限制数据库访问权限
- [ ] 配置日志审计

### 联系支持

如果遇到部署问题，请：

1. 查看应用日志
2. 检查系统资源
3. 验证配置文件
4. 联系技术支持团队

---

**注意**: 在生产环境部署前，请务必在测试环境中验证所有配置和功能。