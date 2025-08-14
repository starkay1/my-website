#!/bin/bash

# SpacePlus GitHub Secrets 配置助手
# 此脚本帮助用户在 GitHub 仓库中配置所需的 Secrets

set -e

echo "🔐 SpacePlus GitHub Secrets 配置助手"
echo "======================================"
echo ""

# 检查是否安装了 gh CLI
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) 未安装"
    echo "请先安装 GitHub CLI: https://cli.github.com/"
    echo "macOS: brew install gh"
    echo "然后运行: gh auth login"
    exit 1
fi

# 检查是否已登录
if ! gh auth status &> /dev/null; then
    echo "❌ 未登录 GitHub CLI"
    echo "请先运行: gh auth login"
    exit 1
fi

# 获取当前仓库信息
REPO_INFO=$(gh repo view --json owner,name)
OWNER=$(echo $REPO_INFO | jq -r '.owner.login')
REPO=$(echo $REPO_INFO | jq -r '.name')

echo "📁 当前仓库: $OWNER/$REPO"
echo ""

# 读取生成的密钥文件
SECRETS_FILE=$(ls github-secrets-*.txt 2>/dev/null | head -1)
if [ -z "$SECRETS_FILE" ]; then
    echo "❌ 未找到密钥文件 (github-secrets-*.txt)"
    echo "请先运行: ./scripts/generate-secrets.sh"
    exit 1
fi

echo "📄 使用密钥文件: $SECRETS_FILE"
echo ""

# 确认操作
read -p "是否要为仓库 $OWNER/$REPO 配置 GitHub Secrets? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "操作已取消"
    exit 0
fi

echo ""
echo "🚀 开始配置 GitHub Secrets..."
echo ""

# 配置必需的 Secrets
echo "📝 配置认证密钥..."
JWT_SECRET=$(grep "JWT_SECRET=" $SECRETS_FILE | cut -d'=' -f2)
NEXTAUTH_SECRET=$(grep "NEXTAUTH_SECRET=" $SECRETS_FILE | cut -d'=' -f2)
gh secret set JWT_SECRET --body "$JWT_SECRET"
gh secret set NEXTAUTH_SECRET --body "$NEXTAUTH_SECRET"
echo "✅ 认证密钥配置完成"

echo "📝 配置数据库..."
POSTGRES_DB=$(grep "POSTGRES_DB=" $SECRETS_FILE | cut -d'=' -f2)
POSTGRES_USER=$(grep "POSTGRES_USER=" $SECRETS_FILE | cut -d'=' -f2)
POSTGRES_PASSWORD=$(grep "POSTGRES_PASSWORD=" $SECRETS_FILE | cut -d'=' -f2)
DATABASE_URL=$(grep "DATABASE_URL=" $SECRETS_FILE | cut -d'=' -f2)
gh secret set POSTGRES_DB --body "$POSTGRES_DB"
gh secret set POSTGRES_USER --body "$POSTGRES_USER"
gh secret set POSTGRES_PASSWORD --body "$POSTGRES_PASSWORD"
gh secret set DATABASE_URL --body "$DATABASE_URL"
echo "✅ 数据库配置完成"

echo "📝 配置 Redis..."
REDIS_PASSWORD=$(grep "REDIS_PASSWORD=" $SECRETS_FILE | cut -d'=' -f2)
REDIS_URL=$(grep "REDIS_URL=" $SECRETS_FILE | cut -d'=' -f2)
gh secret set REDIS_PASSWORD --body "$REDIS_PASSWORD"
gh secret set REDIS_URL --body "$REDIS_URL"
echo "✅ Redis 配置完成"

echo "📝 配置环境变量..."
gh secret set NODE_ENV --body "production"
gh secret set NEXTAUTH_URL --body "https://spaceplusworldwide.club"
gh secret set NEXT_PUBLIC_APP_URL --body "https://spaceplusworldwide.club"
gh secret set GITHUB_PAGES --body "true"
echo "✅ 环境变量配置完成"

echo ""
echo "🎉 基础 Secrets 配置完成！"
echo ""
echo "⚠️  还需要手动配置以下 Secrets:"
echo "   1. SMTP_PASSWORD - Gmail 应用专用密码"
echo "   2. GOOGLE_CLIENT_ID - Google OAuth 客户端 ID"
echo "   3. GOOGLE_CLIENT_SECRET - Google OAuth 客户端密钥"
echo "   4. SENTRY_DSN - Sentry 错误监控 DSN (可选)"
echo "   5. NEXT_PUBLIC_GA_ID - Google Analytics ID (可选)"
echo ""
echo "📖 详细配置说明请查看: QUICK_SECRETS_SETUP.md"
echo ""
echo "🚀 配置完成后可以推送代码触发部署:"
echo "   git add ."
echo "   git commit -m 'feat: 配置 GitHub Secrets'"
echo "   git push origin main"
echo ""

# 显示当前配置的 Secrets
echo "📋 当前已配置的 Secrets:"
gh secret list

echo ""
echo "✨ 配置完成！"