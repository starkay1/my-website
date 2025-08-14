#!/bin/bash

# SpacePlus 部署脚本
# 使用方法: ./deploy.sh [环境] [选项]
# 环境: dev, staging, production
# 选项: --build-only, --no-backup, --force

set -e  # 遇到错误时退出

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

# 默认值
ENVIRONMENT="production"
BUILD_ONLY=false
NO_BACKUP=false
FORCE=false

# 解析命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        dev|staging|production)
            ENVIRONMENT="$1"
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
        --no-backup)
            NO_BACKUP=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            echo "使用方法: $0 [环境] [选项]"
            echo "环境: dev, staging, production (默认: production)"
            echo "选项:"
            echo "  --build-only    仅构建，不部署"
            echo "  --no-backup     跳过数据库备份"
            echo "  --force         强制部署，跳过确认"
            echo "  -h, --help      显示此帮助信息"
            exit 0
            ;;
        *)
            log_error "未知参数: $1"
            exit 1
            ;;
    esac
done

# 检查必要的工具
check_dependencies() {
    log_info "检查依赖项..."
    
    local deps=("docker" "docker-compose" "git" "node" "npm")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            log_error "缺少依赖: $dep"
            exit 1
        fi
    done
    
    log_success "所有依赖项检查通过"
}

# 检查 Git 状态
check_git_status() {
    if [[ "$ENVIRONMENT" == "production" && "$FORCE" == false ]]; then
        log_info "检查 Git 状态..."
        
        if [[ -n $(git status --porcelain) ]]; then
            log_error "工作目录不干净，请提交或暂存更改"
            exit 1
        fi
        
        local current_branch=$(git branch --show-current)
        if [[ "$current_branch" != "main" && "$current_branch" != "master" ]]; then
            log_warning "当前分支不是 main/master: $current_branch"
            if [[ "$FORCE" == false ]]; then
                read -p "是否继续? (y/N): " -n 1 -r
                echo
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    exit 1
                fi
            fi
        fi
    fi
}

# 数据库备份
backup_database() {
    if [[ "$NO_BACKUP" == true ]]; then
        log_info "跳过数据库备份"
        return
    fi
    
    log_info "备份数据库..."
    
    local backup_dir="./backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="${backup_dir}/spaceplus_${ENVIRONMENT}_${timestamp}.sql"
    
    mkdir -p "$backup_dir"
    
    case $ENVIRONMENT in
        "production")
            docker-compose exec -T postgres pg_dump -U spaceplus spaceplus > "$backup_file"
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml exec -T postgres pg_dump -U spaceplus spaceplus_staging > "$backup_file"
            ;;
        "dev")
            docker-compose -f docker-compose.dev.yml exec -T postgres-dev pg_dump -U spaceplus spaceplus_dev > "$backup_file"
            ;;
    esac
    
    if [[ -f "$backup_file" ]]; then
        log_success "数据库备份完成: $backup_file"
    else
        log_error "数据库备份失败"
        exit 1
    fi
}

# 构建应用
build_application() {
    log_info "构建应用..."
    
    # 安装依赖
    log_info "安装依赖项..."
    npm ci
    
    # 运行测试
    log_info "运行测试..."
    npm run test:ci
    
    # 类型检查
    log_info "类型检查..."
    npm run type-check
    
    # 生成 Prisma 客户端
    log_info "生成 Prisma 客户端..."
    npx prisma generate
    
    # 构建 Docker 镜像
    log_info "构建 Docker 镜像..."
    case $ENVIRONMENT in
        "production")
            docker-compose build --no-cache
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml build --no-cache
            ;;
        "dev")
            docker-compose -f docker-compose.dev.yml build --no-cache
            ;;
    esac
    
    log_success "应用构建完成"
}

# 部署应用
deploy_application() {
    if [[ "$BUILD_ONLY" == true ]]; then
        log_info "仅构建模式，跳过部署"
        return
    fi
    
    log_info "部署应用到 $ENVIRONMENT 环境..."
    
    # 停止现有服务
    log_info "停止现有服务..."
    case $ENVIRONMENT in
        "production")
            docker-compose down
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml down
            ;;
        "dev")
            docker-compose -f docker-compose.dev.yml down
            ;;
    esac
    
    # 启动新服务
    log_info "启动新服务..."
    case $ENVIRONMENT in
        "production")
            docker-compose up -d
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml up -d
            ;;
        "dev")
            docker-compose -f docker-compose.dev.yml up -d
            ;;
    esac
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 运行数据库迁移
    log_info "运行数据库迁移..."
    case $ENVIRONMENT in
        "production")
            docker-compose exec app npx prisma migrate deploy
            ;;
        "staging")
            docker-compose -f docker-compose.staging.yml exec app npx prisma migrate deploy
            ;;
        "dev")
            docker-compose -f docker-compose.dev.yml exec app-dev npx prisma migrate deploy
            ;;
    esac
    
    log_success "应用部署完成"
}

# 健康检查
health_check() {
    if [[ "$BUILD_ONLY" == true ]]; then
        return
    fi
    
    log_info "执行健康检查..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost/health &> /dev/null; then
            log_success "健康检查通过"
            return
        fi
        
        log_info "健康检查失败，重试 $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    log_error "健康检查失败，部署可能有问题"
    exit 1
}

# 清理旧镜像
cleanup() {
    log_info "清理旧 Docker 镜像..."
    docker image prune -f
    log_success "清理完成"
}

# 主函数
main() {
    log_info "开始部署到 $ENVIRONMENT 环境"
    
    # 确认部署
    if [[ "$FORCE" == false ]]; then
        echo -e "${YELLOW}即将部署到 $ENVIRONMENT 环境${NC}"
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "部署已取消"
            exit 0
        fi
    fi
    
    check_dependencies
    check_git_status
    backup_database
    build_application
    deploy_application
    health_check
    cleanup
    
    log_success "部署完成！"
    
    if [[ "$BUILD_ONLY" == false ]]; then
        echo -e "${GREEN}应用现在运行在:${NC}"
        case $ENVIRONMENT in
            "production")
                echo "  - http://localhost (HTTP)"
                echo "  - https://localhost (HTTPS, 如果配置了 SSL)"
                ;;
            "staging")
                echo "  - http://localhost:3001"
                ;;
            "dev")
                echo "  - http://localhost:3000"
                ;;
        esac
    fi
}

# 执行主函数
main "$@"