#!/bin/bash

# SpacePlus 部署前检查脚本
# 验证所有配置是否正确，确保部署成功

# 不使用 set -e，允许脚本继续执行即使某些检查失败

echo "🔍 SpacePlus 部署前检查"
echo "========================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查结果统计
PASSED=0
FAILED=0
WARNING=0

# 检查函数
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING++))
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "📋 1. 基础文件检查"
echo "------------------"

# 检查关键配置文件
if [ -f "next.config.js" ]; then
    check_pass "next.config.js 存在"
else
    check_fail "next.config.js 缺失"
fi

if [ -f "package.json" ]; then
    check_pass "package.json 存在"
else
    check_fail "package.json 缺失"
fi

if [ -f ".github/workflows/github-pages.yml" ]; then
    check_pass "GitHub Pages 工作流存在"
else
    check_fail "GitHub Pages 工作流缺失"
fi

if [ -f "CNAME" ]; then
    check_pass "CNAME 文件存在"
    DOMAIN=$(cat CNAME)
    check_info "域名: $DOMAIN"
else
    check_warn "CNAME 文件缺失 - 将使用 GitHub Pages 默认域名"
fi

echo ""
echo "🔧 2. Next.js 配置检查"
echo "---------------------"

# 检查 next.config.js 配置
if grep -q "output:" next.config.js && grep -q "GITHUB_PAGES" next.config.js; then
    check_pass "静态导出配置正确 (条件性)"
elif grep -q "output: 'export'" next.config.js; then
    check_pass "静态导出配置正确"
else
    check_fail "静态导出配置缺失"
fi

if grep -q "trailingSlash: true" next.config.js; then
    check_pass "URL 尾部斜杠配置正确"
else
    check_warn "建议添加 trailingSlash: true 配置"
fi

if grep -q "images:" next.config.js; then
    check_pass "图片配置存在"
else
    check_warn "图片配置可能需要优化"
fi

echo ""
echo "📦 3. 依赖检查"
echo "-------------"

# 检查关键依赖
if npm list next &>/dev/null; then
    NEXT_VERSION=$(npm list next --depth=0 | grep next | cut -d'@' -f2)
    check_pass "Next.js 已安装 (v$NEXT_VERSION)"
else
    check_fail "Next.js 未安装"
fi

if npm list react &>/dev/null; then
    check_pass "React 已安装"
else
    check_fail "React 未安装"
fi

if npm list typescript &>/dev/null; then
    check_pass "TypeScript 已安装"
else
    check_warn "TypeScript 未安装"
fi

echo ""
echo "🏗️  4. 构建测试"
echo "---------------"

# 测试静态构建
check_info "开始测试静态构建..."
if npm run build:static &>/dev/null; then
    check_pass "静态构建成功"
    
    # 检查输出目录
    if [ -d "out" ]; then
        check_pass "输出目录 'out' 已生成"
        
        # 检查关键文件（多语言应用的主页在语言目录下）
        if [ -f "out/en/index.html" ] && [ -f "out/zh/index.html" ]; then
            check_pass "多语言主页文件已生成"
        elif [ -f "out/index.html" ]; then
            check_pass "主页文件已生成"
        else
            check_fail "主页文件缺失"
        fi
        
        if [ -f "out/404.html" ]; then
            check_pass "404 页面已生成"
        else
            check_warn "404 页面缺失"
        fi
        
        # 检查多语言页面
        if [ -d "out/en" ] && [ -d "out/zh" ]; then
            check_pass "多语言页面已生成"
        else
            check_warn "多语言页面可能缺失"
        fi
        
        # 检查静态资源
        if [ -d "out/_next" ]; then
            check_pass "静态资源已生成"
        else
            check_fail "静态资源缺失"
        fi
        
        # 计算输出大小
        OUT_SIZE=$(du -sh out | cut -f1)
        check_info "输出目录大小: $OUT_SIZE"
        
    else
        check_fail "输出目录 'out' 未生成"
    fi
else
    check_fail "静态构建失败"
    echo "请运行 'npm run build:static' 查看详细错误信息"
fi

echo ""
echo "🔐 5. GitHub Secrets 检查"
echo "-------------------------"

# 检查 GitHub CLI
if command -v gh &> /dev/null; then
    check_pass "GitHub CLI 已安装"
    
    if gh auth status &> /dev/null; then
        check_pass "GitHub CLI 已登录"
        
        # 检查 Secrets
        SECRETS=$(gh secret list 2>/dev/null || echo "")
        if [ -n "$SECRETS" ]; then
            check_pass "GitHub Secrets 已配置"
            
            # 检查必需的 Secrets
            REQUIRED_SECRETS=("JWT_SECRET" "NEXTAUTH_SECRET" "DATABASE_URL")
            for secret in "${REQUIRED_SECRETS[@]}"; do
                if echo "$SECRETS" | grep -q "$secret"; then
                    check_pass "$secret 已配置"
                else
                    check_fail "$secret 缺失"
                fi
            done
            
            # 检查推荐的 Secrets
            RECOMMENDED_SECRETS=("SMTP_PASSWORD" "GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET")
            for secret in "${RECOMMENDED_SECRETS[@]}"; do
                if echo "$SECRETS" | grep -q "$secret"; then
                    check_pass "$secret 已配置"
                else
                    check_warn "$secret 未配置 (推荐)"
                fi
            done
        else
            check_warn "未检测到 GitHub Secrets"
        fi
    else
        check_warn "GitHub CLI 未登录"
    fi
else
    check_warn "GitHub CLI 未安装"
fi

echo ""
echo "🌐 6. 域名和 DNS 检查"
echo "--------------------"

if [ -f "CNAME" ]; then
    DOMAIN=$(cat CNAME)
    check_info "检查域名: $DOMAIN"
    
    # 检查域名解析
    if nslookup "$DOMAIN" &>/dev/null; then
        check_pass "域名解析正常"
    else
        check_warn "域名解析可能有问题"
    fi
    
    # 检查 HTTPS
    if curl -s -I "https://$DOMAIN" &>/dev/null; then
        check_pass "HTTPS 访问正常"
    else
        check_warn "HTTPS 访问可能有问题"
    fi
else
    check_info "使用 GitHub Pages 默认域名"
fi

echo ""
echo "📊 7. 检查结果汇总"
echo "------------------"

echo -e "${GREEN}✅ 通过: $PASSED${NC}"
echo -e "${YELLOW}⚠️  警告: $WARNING${NC}"
echo -e "${RED}❌ 失败: $FAILED${NC}"

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有关键检查都已通过！${NC}"
    echo -e "${GREEN}✨ 项目已准备好部署到 GitHub Pages${NC}"
    echo ""
    echo "🚀 下一步操作:"
    echo "1. 确保所有 GitHub Secrets 已配置"
    echo "2. 推送代码到 main 分支"
    echo "3. 监控 GitHub Actions 部署过程"
    echo ""
    echo "推送命令:"
    echo "git add ."
    echo "git commit -m 'feat: 准备部署到 GitHub Pages'"
    echo "git push origin main"
else
    echo -e "${RED}⚠️  发现 $FAILED 个关键问题需要解决${NC}"
    echo "请修复上述问题后重新运行检查"
fi

if [ $WARNING -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 建议处理 $WARNING 个警告项以获得更好的部署体验${NC}"
fi

echo ""
echo "📖 更多信息:"
echo "- 部署指南: DEPLOYMENT_GUIDE.md"
echo "- Secrets 配置: MANUAL_SECRETS_SETUP.md"
echo "- 快速配置: QUICK_SECRETS_SETUP.md"

exit $FAILED