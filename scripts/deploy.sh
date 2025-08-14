#!/bin/bash

# Spaceplus Worldwide 部署脚本
# 使用方法: ./scripts/deploy.sh [environment]
# 环境选项: staging, production

set -e  # 遇到错误立即退出

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

# 检查参数
ENVIRONMENT=${1:-staging}

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    log_error "无效的环境参数: $ENVIRONMENT"
    log_info "使用方法: $0 [staging|production]"
    exit 1
fi

log_info "开始部署到 $ENVIRONMENT 环境..."

# 检查必要的工具
check_dependencies() {
    log_info "检查依赖工具..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装或不在 PATH 中"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装或不在 PATH 中"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装或不在 PATH 中"
        exit 1
    fi
    
    log_success "所有依赖工具检查通过"
}

# 检查环境变量文件
check_env_file() {
    local env_file=".env.${ENVIRONMENT}"
    
    if [[ ! -f "$env_file" ]]; then
        log_error "环境变量文件 $env_file 不存在"
        log_info "请复制 .env.${ENVIRONMENT}.example 为 $env_file 并填入正确的值"
        exit 1
    fi
    
    log_success "环境变量文件检查通过"
}

# 备份当前部署
backup_current_deployment() {
    if [[ "$ENVIRONMENT" == "production" ]]; then
        log_info "备份当前生产环境..."
        
        # 创建备份目录
        BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
        mkdir -p "$BACKUP_DIR"
        
        # 备份数据库
        if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
            log_info "备份数据库..."
            docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U spaceplus spaceplus > "$BACKUP_DIR/database.sql"
            log_success "数据库备份完成: $BACKUP_DIR/database.sql"
        fi
        
        # 备份上传文件
        if [[ -d "uploads" ]]; then
            log_info "备份上传文件..."
            cp -r uploads "$BACKUP_DIR/"
            log_success "上传文件备份完成: $BACKUP_DIR/uploads"
        fi
        
        log_success "备份完成: $BACKUP_DIR"
    fi
}

# 构建和部署
deploy() {
    local compose_file="docker-compose.yml"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        compose_file="docker-compose.prod.yml"
    fi
    
    log_info "使用配置文件: $compose_file"
    
    # 拉取最新代码
    log_info "拉取最新代码..."
    git pull origin main
    
    # 停止现有服务
    log_info "停止现有服务..."
    docker-compose -f "$compose_file" down
    
    # 构建新镜像
    log_info "构建应用镜像..."
    docker-compose -f "$compose_file" build --no-cache app
    
    # 启动数据库服务
    log_info "启动数据库服务..."
    docker-compose -f "$compose_file" up -d postgres redis
    
    # 等待数据库启动
    log_info "等待数据库启动..."
    sleep 10
    
    # 运行数据库迁移
    log_info "运行数据库迁移..."
    docker-compose -f "$compose_file" run --rm app npx prisma migrate deploy
    
    # 启动所有服务
    log_info "启动所有服务..."
    docker-compose -f "$compose_file" up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 15
    
    # 健康检查
    health_check
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost:3000/api/health &> /dev/null; then
            log_success "应用健康检查通过"
            return 0
        fi
        
        log_info "健康检查失败，重试中... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_error "健康检查失败，部署可能有问题"
    
    # 显示日志
    log_info "显示应用日志:"
    docker-compose logs --tail=50 app
    
    return 1
}

# 清理旧镜像
cleanup() {
    log_info "清理旧的 Docker 镜像..."
    docker image prune -f
    log_success "清理完成"
}

# 显示部署信息
show_deployment_info() {
    log_success "部署完成！"
    echo
    log_info "部署信息:"
    echo "  环境: $ENVIRONMENT"
    echo "  时间: $(date)"
    echo "  Git 提交: $(git rev-parse --short HEAD)"
    echo
    log_info "服务状态:"
    docker-compose ps
    echo
    log_info "访问地址:"
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo "  生产环境: https://your-domain.com"
    else
        echo "  测试环境: http://localhost:3000"
    fi
    echo "  健康检查: http://localhost:3000/api/health"
    echo
    log_info "有用的命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  重启服务: docker-compose restart"
    echo "  停止服务: docker-compose down"
}

# 主函数
main() {
    log_info "Spaceplus Worldwide 部署脚本"
    log_info "目标环境: $ENVIRONMENT"
    echo
    
    check_dependencies
    check_env_file
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        # 生产环境需要确认
        read -p "确认部署到生产环境？这将影响线上服务 (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
        
        backup_current_deployment
    fi
    
    deploy
    cleanup
    show_deployment_info
    
    log_success "部署流程完成！"
}

# 错误处理
trap 'log_error "部署过程中发生错误，请检查日志"' ERR

# 执行主函数
main "$@"