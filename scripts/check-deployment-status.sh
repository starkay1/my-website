#!/bin/bash

# SpacePlus 部署状态检查脚本
# 检查项目的部署配置和准备状态

set -e

echo "🚀 SpacePlus 部署状态检查"
echo "=============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

check_env_var() {
    if grep -q "^$1=" .env.production 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 已配置"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 未配置或缺失"
        return 1
    fi
}

echo -e "\n${BLUE}1. 基础文件检查${NC}"
echo "-------------------"
check_file "package.json" "package.json 存在"
check_file "next.config.js" "Next.js 配置文件存在"
check_file "CNAME" "GitHub Pages CNAME 文件存在"
check_file ".env.production" "生产环境配置文件存在"
check_file "scripts/build-static.js" "静态构建脚本存在"
check_file "scripts/verify-domain.sh" "域名验证脚本存在"

echo -e "\n${BLUE}2. GitHub Actions 工作流检查${NC}"
echo "----------------------------"
check_file ".github/workflows/github-pages.yml" "GitHub Pages 工作流存在"
check_file ".github/workflows/deploy.yml" "部署工作流存在"
check_file ".github/workflows/ci-cd.yml" "CI/CD 工作流存在"

echo -e "\n${BLUE}3. 源代码结构检查${NC}"
echo "---------------------"
check_dir "src/app/[locale]" "多语言路由结构存在"
check_file "src/app/[locale]/layout.tsx" "多语言布局文件存在"
check_file "src/app/[locale]/page.tsx" "主页文件存在"
check_file "src/lib/sentry.ts" "Sentry 配置文件存在"
check_file "src/components/analytics/UserBehaviorTracker.tsx" "用户行为跟踪组件存在"

echo -e "\n${BLUE}4. 生产环境变量检查${NC}"
echo "----------------------"
if [ -f ".env.production" ]; then
    check_env_var "NODE_ENV"
    check_env_var "NEXT_PUBLIC_BASE_URL"
    check_env_var "NEXTAUTH_URL"
    check_env_var "JWT_SECRET"
    check_env_var "NEXTAUTH_SECRET"
    check_env_var "NEXT_PUBLIC_GA_ID"
    check_env_var "SENTRY_DSN"
    check_env_var "NEXT_PUBLIC_SENTRY_DSN"
    check_env_var "GOOGLE_CLIENT_ID"
    check_env_var "SMTP_HOST"
else
    echo -e "${RED}✗${NC} .env.production 文件不存在"
fi

echo -e "\n${BLUE}5. 构建测试${NC}"
echo "-------------"
echo "正在测试静态构建..."
if npm run build:static > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 静态构建成功"
    
    # 检查输出目录
    if [ -d "out" ]; then
        echo -e "${GREEN}✓${NC} 输出目录 'out' 已生成"
        
        # 检查关键文件
        if [ -f "out/index.html" ] || [ -f "out/zh/index.html" ]; then
            echo -e "${GREEN}✓${NC} 主页 HTML 文件已生成"
        else
            echo -e "${YELLOW}⚠${NC} 主页 HTML 文件未找到"
        fi
        
        if [ -d "out/_next" ]; then
            echo -e "${GREEN}✓${NC} Next.js 静态资源已生成"
        else
            echo -e "${YELLOW}⚠${NC} Next.js 静态资源未找到"
        fi
    else
        echo -e "${RED}✗${NC} 输出目录 'out' 未生成"
    fi
else
    echo -e "${RED}✗${NC} 静态构建失败"
    echo "请检查构建错误并修复后重试"
fi

echo -e "\n${BLUE}6. 依赖检查${NC}"
echo "-------------"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js 版本: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js 未安装"
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm 版本: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm 未安装"
fi

echo -e "\n${BLUE}7. 域名配置检查${NC}"
echo "------------------"
if [ -f "CNAME" ]; then
    DOMAIN=$(cat CNAME)
    echo -e "${GREEN}✓${NC} 配置的域名: $DOMAIN"
    
    # 检查域名解析
    if command -v dig >/dev/null 2>&1; then
        echo "正在检查域名解析..."
        if dig +short "$DOMAIN" >/dev/null 2>&1; then
            IP=$(dig +short "$DOMAIN" | tail -n1)
            echo -e "${GREEN}✓${NC} 域名解析正常: $DOMAIN -> $IP"
        else
            echo -e "${YELLOW}⚠${NC} 域名解析可能未配置或正在传播中"
        fi
    else
        echo -e "${YELLOW}⚠${NC} dig 命令不可用，跳过域名解析检查"
    fi
else
    echo -e "${RED}✗${NC} CNAME 文件不存在"
fi

echo -e "\n${BLUE}8. 总结${NC}"
echo "--------"
echo "检查完成！请查看上述结果并修复任何标记为 ✗ 或 ⚠ 的问题。"
echo ""
echo "下一步操作建议："
echo "1. 确保所有 GitHub Secrets 已正确配置"
echo "2. 检查域名 DNS 配置是否指向 GitHub Pages"
echo "3. 推送代码到 main 分支触发自动部署"
echo "4. 监控 GitHub Actions 工作流执行状态"
echo "5. 部署完成后访问网站进行功能测试"

echo -e "\n${GREEN}🎉 部署状态检查完成！${NC}"