#!/bin/bash

# SpacePlus 域名和SSL验证脚本
# 使用方法: ./scripts/verify-domain.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 域名配置
DOMAIN="spaceplusworldwide.club"
WWW_DOMAIN="www.spaceplusworldwide.club"
GITHUB_PAGES_IP="185.199.108.153"

log_info "开始验证域名配置: $DOMAIN"

# 检查DNS解析
check_dns() {
    log_info "检查DNS解析..."
    
    # 检查主域名A记录
    log_info "检查 $DOMAIN 的A记录..."
    DOMAIN_IP=$(dig +short $DOMAIN A | head -n1)
    
    if [[ -n "$DOMAIN_IP" ]]; then
        log_success "$DOMAIN 解析到: $DOMAIN_IP"
        
        # 检查是否指向GitHub Pages
        if [[ "$DOMAIN_IP" == "185.199.108."* ]] || [[ "$DOMAIN_IP" == "185.199.109."* ]] || [[ "$DOMAIN_IP" == "185.199.110."* ]] || [[ "$DOMAIN_IP" == "185.199.111."* ]]; then
            log_success "域名正确指向GitHub Pages"
        else
            log_warning "域名未指向GitHub Pages IP范围"
            log_info "当前IP: $DOMAIN_IP"
            log_info "GitHub Pages IP范围: 185.199.108.0/22"
        fi
    else
        log_error "无法解析 $DOMAIN"
        return 1
    fi
    
    # 检查WWW域名CNAME记录
    log_info "检查 $WWW_DOMAIN 的CNAME记录..."
    WWW_CNAME=$(dig +short $WWW_DOMAIN CNAME | head -n1)
    
    if [[ -n "$WWW_CNAME" ]]; then
        log_success "$WWW_DOMAIN CNAME记录: $WWW_CNAME"
        if [[ "$WWW_CNAME" == "$DOMAIN." ]] || [[ "$WWW_CNAME" == "$DOMAIN" ]]; then
            log_success "WWW域名正确指向主域名"
        else
            log_warning "WWW域名未指向主域名"
        fi
    else
        log_warning "$WWW_DOMAIN 没有CNAME记录"
    fi
}

# 检查HTTP连接
check_http() {
    log_info "检查HTTP连接..."
    
    # 检查HTTP重定向到HTTPS
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -L "http://$DOMAIN" || echo "000")
    
    if [[ "$HTTP_STATUS" == "200" ]] || [[ "$HTTP_STATUS" == "301" ]] || [[ "$HTTP_STATUS" == "302" ]]; then
        log_success "HTTP连接正常 (状态码: $HTTP_STATUS)"
    else
        log_error "HTTP连接失败 (状态码: $HTTP_STATUS)"
    fi
}

# 检查HTTPS和SSL证书
check_ssl() {
    log_info "检查HTTPS和SSL证书..."
    
    # 检查HTTPS连接
    HTTPS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" || echo "000")
    
    if [[ "$HTTPS_STATUS" == "200" ]]; then
        log_success "HTTPS连接正常 (状态码: $HTTPS_STATUS)"
    else
        log_error "HTTPS连接失败 (状态码: $HTTPS_STATUS)"
        return 1
    fi
    
    # 检查SSL证书详情
    log_info "检查SSL证书详情..."
    
    # 获取证书信息
    CERT_INFO=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates -subject -issuer 2>/dev/null || echo "")
    
    if [[ -n "$CERT_INFO" ]]; then
        log_success "SSL证书信息:"
        echo "$CERT_INFO" | while IFS= read -r line; do
            echo "  $line"
        done
        
        # 检查证书有效期
        NOT_AFTER=$(echo "$CERT_INFO" | grep "notAfter" | cut -d'=' -f2)
        if [[ -n "$NOT_AFTER" ]]; then
            EXPIRY_DATE=$(date -d "$NOT_AFTER" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$NOT_AFTER" +%s 2>/dev/null || echo "0")
            CURRENT_DATE=$(date +%s)
            DAYS_LEFT=$(( (EXPIRY_DATE - CURRENT_DATE) / 86400 ))
            
            if [[ $DAYS_LEFT -gt 30 ]]; then
                log_success "SSL证书有效期: $DAYS_LEFT 天"
            elif [[ $DAYS_LEFT -gt 7 ]]; then
                log_warning "SSL证书将在 $DAYS_LEFT 天后过期"
            else
                log_error "SSL证书将在 $DAYS_LEFT 天后过期，需要续期"
            fi
        fi
    else
        log_error "无法获取SSL证书信息"
    fi
}

# 检查GitHub Pages配置
check_github_pages() {
    log_info "检查GitHub Pages配置..."
    
    # 检查CNAME文件
    if [[ -f "CNAME" ]]; then
        CNAME_CONTENT=$(cat CNAME | tr -d '\n\r')
        log_success "CNAME文件存在，内容: $CNAME_CONTENT"
        
        if [[ "$CNAME_CONTENT" == "$DOMAIN" ]]; then
            log_success "CNAME文件配置正确"
        else
            log_warning "CNAME文件内容与预期域名不匹配"
            log_info "预期: $DOMAIN"
            log_info "实际: $CNAME_CONTENT"
        fi
    else
        log_error "CNAME文件不存在"
    fi
    
    # 检查GitHub Actions状态
    log_info "检查最近的GitHub Actions运行状态..."
    
    # 检查是否有.github/workflows目录
    if [[ -d ".github/workflows" ]]; then
        log_success "GitHub Actions工作流配置存在"
        
        # 列出工作流文件
        WORKFLOW_FILES=$(find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null || echo "")
        if [[ -n "$WORKFLOW_FILES" ]]; then
            log_success "发现工作流文件:"
            echo "$WORKFLOW_FILES" | while IFS= read -r file; do
                echo "  - $file"
            done
        else
            log_warning "未发现工作流文件"
        fi
    else
        log_warning "GitHub Actions工作流配置不存在"
    fi
}

# 检查网站内容
check_website_content() {
    log_info "检查网站内容..."
    
    # 获取首页内容
    HOMEPAGE_CONTENT=$(curl -s "https://$DOMAIN" || echo "")
    
    if [[ -n "$HOMEPAGE_CONTENT" ]]; then
        # 检查是否包含预期内容
        if echo "$HOMEPAGE_CONTENT" | grep -q "Spaceplus"; then
            log_success "网站内容正常，包含Spaceplus品牌信息"
        else
            log_warning "网站内容可能不正确，未找到Spaceplus品牌信息"
        fi
        
        # 检查是否是GitHub Pages默认页面
        if echo "$HOMEPAGE_CONTENT" | grep -q "GitHub Pages"; then
            log_warning "网站显示GitHub Pages默认页面"
        fi
        
        # 检查页面大小
        CONTENT_SIZE=${#HOMEPAGE_CONTENT}
        if [[ $CONTENT_SIZE -gt 1000 ]]; then
            log_success "页面内容大小正常: $CONTENT_SIZE 字符"
        else
            log_warning "页面内容较少: $CONTENT_SIZE 字符"
        fi
    else
        log_error "无法获取网站内容"
    fi
}

# 检查分析和监控配置
check_analytics() {
    log_info "检查分析和监控配置..."
    
    # 检查Google Analytics
    if echo "$HOMEPAGE_CONTENT" | grep -q "gtag\|google-analytics"; then
        log_success "检测到Google Analytics配置"
    else
        log_warning "未检测到Google Analytics配置"
    fi
    
    # 检查其他监控工具
    if echo "$HOMEPAGE_CONTENT" | grep -q "sentry"; then
        log_success "检测到Sentry错误监控"
    else
        log_warning "未检测到Sentry错误监控"
    fi
}

# 生成报告
generate_report() {
    log_info "生成验证报告..."
    
    REPORT_FILE="domain-verification-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
SpacePlus 域名验证报告
生成时间: $(date)
域名: $DOMAIN

=== DNS解析 ===
主域名A记录: $DOMAIN_IP
WWW域名CNAME: $WWW_CNAME

=== HTTP/HTTPS状态 ===
HTTP状态码: $HTTP_STATUS
HTTPS状态码: $HTTPS_STATUS

=== SSL证书信息 ===
$CERT_INFO

=== 网站内容 ===
页面大小: ${#HOMEPAGE_CONTENT} 字符

=== 建议 ===
1. 定期检查SSL证书有效期
2. 监控网站可用性
3. 确保GitHub Actions正常运行
4. 配置域名监控告警

EOF
    
    log_success "验证报告已生成: $REPORT_FILE"
}

# 主函数
main() {
    log_info "开始域名和SSL验证流程"
    
    # 检查必要工具
    for tool in dig curl openssl; do
        if ! command -v $tool &> /dev/null; then
            log_error "缺少必要工具: $tool"
            exit 1
        fi
    done
    
    # 执行检查
    check_dns
    check_http
    check_ssl
    check_github_pages
    check_website_content
    check_analytics
    generate_report
    
    log_success "域名验证完成！"
    
    echo
    log_info "验证摘要:"
    echo "  - 域名: $DOMAIN"
    echo "  - DNS解析: $([ -n "$DOMAIN_IP" ] && echo "✓" || echo "✗")"
    echo "  - HTTPS连接: $([ "$HTTPS_STATUS" == "200" ] && echo "✓" || echo "✗")"
    echo "  - SSL证书: $([ -n "$CERT_INFO" ] && echo "✓" || echo "✗")"
    echo "  - 网站内容: $([ ${#HOMEPAGE_CONTENT} -gt 1000 ] && echo "✓" || echo "✗")"
    echo
    
    log_info "如需详细信息，请查看生成的报告文件"
}

# 执行主函数
main "$@"