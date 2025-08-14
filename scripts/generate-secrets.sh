#!/bin/bash

# GitHub Secrets 生成脚本
# 自动生成部署所需的密钥和配置值

set -e

echo "🔐 GitHub Secrets 生成工具"
echo "=============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查必需工具
check_tool() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo -e "${RED}错误: $1 未安装${NC}"
        echo "请安装 $1 后重试"
        exit 1
    fi
}

echo -e "${BLUE}检查必需工具...${NC}"
check_tool "openssl"
check_tool "uuidgen"

echo -e "${GREEN}✓ 所有工具已就绪${NC}\n"

# 生成密钥函数
generate_secret() {
    openssl rand -base64 32 | tr -d "\n"
}

generate_hex() {
    openssl rand -hex 16 | tr -d "\n"
}

generate_uuid() {
    uuidgen | tr '[:upper:]' '[:lower:]' | tr -d "\n"
}

# 创建输出文件
OUTPUT_FILE="github-secrets-$(date +%Y%m%d-%H%M%S).txt"
echo "# GitHub Secrets 配置" > "$OUTPUT_FILE"
echo "# 生成时间: $(date)" >> "$OUTPUT_FILE"
echo "# 请将以下值配置到 GitHub Repository Secrets 中" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}1. 生成认证和安全密钥${NC}"
echo "----------------------------"

JWT_SECRET=$(generate_secret)
NEXTAUTH_SECRET=$(generate_secret)

echo "JWT_SECRET: $JWT_SECRET"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"

echo "# 认证和安全" >> "$OUTPUT_FILE"
echo "JWT_SECRET=$JWT_SECRET" >> "$OUTPUT_FILE"
echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}\n2. 生成数据库配置${NC}"
echo "----------------------"

DB_PASSWORD=$(generate_hex)
DB_NAME="spaceplus_prod"
DB_USER="spaceplus"

echo "数据库名称: $DB_NAME"
echo "数据库用户: $DB_USER"
echo "数据库密码: $DB_PASSWORD"

echo "# 数据库配置" >> "$OUTPUT_FILE"
echo "POSTGRES_DB=$DB_NAME" >> "$OUTPUT_FILE"
echo "POSTGRES_USER=$DB_USER" >> "$OUTPUT_FILE"
echo "POSTGRES_PASSWORD=$DB_PASSWORD" >> "$OUTPUT_FILE"
echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}\n3. 生成 Redis 配置${NC}"
echo "--------------------"

REDIS_PASSWORD=$(generate_hex)

echo "Redis 密码: $REDIS_PASSWORD"

echo "# Redis 配置" >> "$OUTPUT_FILE"
echo "REDIS_URL=redis://localhost:6379" >> "$OUTPUT_FILE"
echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}\n4. 邮件服务配置模板${NC}"
echo "------------------------"

echo "请手动配置以下邮件服务信息:"
echo "- SMTP_HOST (例如: smtp.gmail.com)"
echo "- SMTP_PORT (例如: 587)"
echo "- SMTP_USER (您的邮箱地址)"
echo "- SMTP_PASS (应用专用密码)"

echo "# 邮件服务配置 (请手动填写)" >> "$OUTPUT_FILE"
echo "SMTP_HOST=smtp.gmail.com" >> "$OUTPUT_FILE"
echo "SMTP_PORT=587" >> "$OUTPUT_FILE"
echo "SMTP_USER=your-email@gmail.com" >> "$OUTPUT_FILE"
echo "SMTP_PASS=your-app-password" >> "$OUTPUT_FILE"
echo "SMTP_FROM=noreply@spaceplusworldwide.club" >> "$OUTPUT_FILE"
echo "SMTP_FROM_NAME=SpacePlus Worldwide" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "# 通知邮箱配置" >> "$OUTPUT_FILE"
echo "NOTIFICATION_EMAIL=notifications@spaceplusworldwide.club" >> "$OUTPUT_FILE"
echo "HR_EMAIL=hr@spaceplusworldwide.club" >> "$OUTPUT_FILE"
echo "SUPPORT_EMAIL=support@spaceplusworldwide.club" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${BLUE}\n5. 第三方服务配置模板${NC}"
echo "----------------------------"

echo "请手动配置以下第三方服务:"
echo "- Google OAuth (Google Cloud Console)"
echo "- Sentry (sentry.io)"
echo "- Google Analytics (analytics.google.com)"

echo "# Google OAuth 配置 (请手动填写)" >> "$OUTPUT_FILE"
echo "GOOGLE_CLIENT_ID=your-google-client-id" >> "$OUTPUT_FILE"
echo "GOOGLE_CLIENT_SECRET=your-google-client-secret" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "# Sentry 配置 (请手动填写)" >> "$OUTPUT_FILE"
echo "SENTRY_DSN=https://your-dsn@sentry.io/project-id" >> "$OUTPUT_FILE"
echo "NEXT_PUBLIC_SENTRY_DSN=https://your-public-dsn@sentry.io/project-id" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "# Google Analytics 配置 (请手动填写)" >> "$OUTPUT_FILE"
echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" >> "$OUTPUT_FILE"
echo "NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "# 可选配置" >> "$OUTPUT_FILE"
echo "VERCEL_ANALYTICS_ID=your-vercel-analytics-id" >> "$OUTPUT_FILE"
echo "NEXT_PUBLIC_OPTIMIZE_ID=GTM-XXXXXXX" >> "$OUTPUT_FILE"
echo "CONTACT_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${GREEN}\n✅ 密钥生成完成！${NC}"
echo "=============================="
echo -e "配置文件已保存到: ${YELLOW}$OUTPUT_FILE${NC}"
echo ""
echo -e "${BLUE}下一步操作:${NC}"
echo "1. 查看生成的配置文件"
echo "2. 手动填写第三方服务配置"
echo "3. 在 GitHub 仓库中配置 Secrets"
echo "4. 删除本地配置文件 (安全考虑)"
echo ""
echo -e "${YELLOW}⚠️  安全提醒:${NC}"
echo "- 请妥善保管生成的密钥"
echo "- 不要将密钥提交到代码仓库"
echo "- 配置完成后删除本地文件"
echo "- 定期更换密钥 (建议每90天)"

echo -e "\n${BLUE}快速配置指南:${NC}"
echo "1. 打开 GitHub 仓库 → Settings → Secrets and variables → Actions"
echo "2. 点击 'New repository secret'"
echo "3. 逐个添加上述配置项"
echo "4. 运行部署测试"

echo -e "\n${GREEN}🎉 配置生成完成！${NC}"

# 询问是否立即查看文件
read -p "是否立即查看生成的配置文件? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}配置文件内容:${NC}"
    echo "=============================="
    cat "$OUTPUT_FILE"
fi

echo -e "\n${BLUE}配置文件位置: $OUTPUT_FILE${NC}"
echo "请按照 GITHUB_SECRETS_CONFIGURATION.md 文档完成配置"