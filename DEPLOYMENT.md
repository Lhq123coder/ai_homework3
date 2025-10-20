# 部署文档

本文档详细说明如何在不同环境中部署 AI 旅行规划助手。

## Docker 镜像

### 镜像信息

**后端镜像**
- 仓库: `registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend`
- 标签: `latest`, `main`, `v1.0.0`

**前端镜像**
- 仓库: `registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend`
- 标签: `latest`, `main`, `v1.0.0`

### 拉取镜像

```bash
# 后端镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest

# 前端镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest
```

## 环境变量配置

### 必需的环境变量

#### 后端 (Backend)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `PORT` | 服务端口 | `3000` |
| `NODE_ENV` | 运行环境 | `production` |
| `JWT_SECRET` | JWT 密钥 | `your-super-secret-key` |
| `SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Supabase 服务密钥 | `eyJhbGc...` |
| `DASHSCOPE_API_KEY` | 阿里云通义千问 API Key | `sk-xxx` |

#### 前端 (Frontend)

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_API_URL` | 后端 API 地址 | `http://localhost:3000/api` |
| `VITE_AMAP_KEY` | 高德地图 API Key | `your-amap-key` |

## 部署方式

### 方式 1: 使用 Docker Compose（推荐）

1. 创建 `.env` 文件：

```bash
# .env
JWT_SECRET=your-super-secret-jwt-key-change-me
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
DASHSCOPE_API_KEY=sk-your-dashscope-api-key
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-key
```

2. 启动服务：

```bash
docker-compose up -d
```

3. 查看状态：

```bash
docker-compose ps
docker-compose logs -f
```

4. 访问应用：
   - 前端: http://localhost
   - 后端: http://localhost:3000

### 方式 2: 手动运行 Docker 容器

#### 后端

```bash
docker run -d \
  --name travel-planner-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e JWT_SECRET=your-jwt-secret \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_SERVICE_KEY=your-service-key \
  -e DASHSCOPE_API_KEY=sk-your-key \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest
```

#### 前端

```bash
docker run -d \
  --name travel-planner-frontend \
  -p 80:80 \
  --link travel-planner-backend:backend \
  --restart unless-stopped \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest
```

### 方式 3: 从源码构建并运行

#### 构建镜像

```bash
# 构建后端镜像
docker build -f Dockerfile.backend -t travel-planner-backend .

# 构建前端镜像
docker build -f Dockerfile.frontend -t travel-planner-frontend \
  --build-arg VITE_API_URL=http://localhost:3000/api \
  --build-arg VITE_AMAP_KEY=your-amap-key \
  .
```

#### 运行容器

```bash
# 创建网络
docker network create travel-network

# 运行后端
docker run -d \
  --name backend \
  --network travel-network \
  -p 3000:3000 \
  --env-file .env \
  travel-planner-backend

# 运行前端
docker run -d \
  --name frontend \
  --network travel-network \
  -p 80:80 \
  travel-planner-frontend
```

## 数据库设置

### Supabase 配置步骤

1. 访问 [Supabase](https://supabase.com) 并登录
2. 创建新项目
3. 等待项目初始化完成
4. 进入 SQL 编辑器
5. 复制 `database/schema.sql` 内容并执行
6. 在项目设置中获取：
   - Project URL (Settings > API > Project URL)
   - Service Role Key (Settings > API > Service role key)

### 验证数据库

在 Supabase Table Editor 中，您应该看到：
- `users` 表
- `trips` 表

## 健康检查

### 后端健康检查

```bash
curl http://localhost:3000/api/health
```

预期响应：
```json
{
  "status": "ok",
  "message": "AI Travel Planner API is running"
}
```

### 前端健康检查

在浏览器中访问: http://localhost

应该看到登录页面。

## GitHub Actions 自动化部署

### 配置 Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

| Secret 名称 | 说明 |
|------------|------|
| `ALIYUN_USERNAME` | 阿里云容器镜像服务用户名 |
| `ALIYUN_PASSWORD` | 阿里云容器镜像服务密码 |
| `VITE_API_URL` | 前端 API URL |
| `VITE_AMAP_KEY` | 高德地图 API Key |

### 触发构建

- 推送到 `main` 分支自动触发构建和推送
- 创建标签（如 `v1.0.0`）触发版本发布

```bash
# 触发新版本构建
git tag v1.0.0
git push origin v1.0.0
```

## 常见问题

### 1. 后端无法连接数据库

**问题**: 后端启动失败，提示 Supabase 连接错误

**解决方案**:
- 检查 `SUPABASE_URL` 和 `SUPABASE_SERVICE_KEY` 是否正确
- 确认 Supabase 项目状态正常
- 检查网络连接

### 2. 前端无法调用后端 API

**问题**: 前端显示网络错误

**解决方案**:
- 检查 `VITE_API_URL` 配置
- 确认后端服务正常运行
- 检查 CORS 配置
- 查看浏览器控制台错误信息

### 3. AI 功能不工作

**问题**: 生成行程时失败或返回模拟数据

**解决方案**:
- 检查 `DASHSCOPE_API_KEY` 是否正确
- 确认 API Key 有足够的调用次数
- 查看后端日志了解详细错误

### 4. 地图不显示

**问题**: 地图区域显示错误信息

**解决方案**:
- 检查 `VITE_AMAP_KEY` 是否正确
- 确认 API Key 已启用 Web 服务
- 检查浏览器控制台错误

### 5. 语音识别不工作

**问题**: 语音输入按钮不显示或无响应

**解决方案**:
- 使用 Chrome/Edge 等支持的浏览器
- 确保使用 HTTPS 或 localhost
- 允许浏览器麦克风权限

## 性能优化

### 1. 使用 CDN

对于生产环境，建议使用 CDN 加速静态资源：

```nginx
# 修改 nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. 数据库索引

确保已创建必要的索引（已包含在 schema.sql 中）：
- `users.email`
- `trips.user_id`
- `trips.created_at`

### 3. Docker 镜像优化

- 使用多阶段构建减小镜像大小
- 使用 Alpine Linux 基础镜像
- 清理不必要的文件和依赖

## 监控和日志

### 查看容器日志

```bash
# 实时查看所有日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend

# 查看最近 100 行日志
docker-compose logs --tail=100 backend
```

### 日志位置

- 后端日志: 容器内 stdout/stderr
- 前端日志: 浏览器控制台
- Nginx 日志: `/var/log/nginx/`

## 备份和恢复

### 数据库备份

Supabase 提供自动备份功能，也可以手动导出：

1. 进入 Supabase Dashboard
2. Database > Backups
3. 下载备份文件

### 应用数据备份

```bash
# 导出环境变量
docker-compose config > backup-config.yml

# 备份数据卷（如果有）
docker run --rm -v travel-planner_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/data-backup.tar.gz /data
```

## 扩展和升级

### 更新应用

```bash
# 拉取最新镜像
docker-compose pull

# 重启服务
docker-compose up -d

# 清理旧镜像
docker image prune -a
```

### 水平扩展

对于高流量场景，可以使用负载均衡器：

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
  
  nginx-lb:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
```

## 安全建议

1. **更改默认密钥**: 务必修改 JWT_SECRET
2. **使用 HTTPS**: 生产环境配置 SSL 证书
3. **限制 API 访问**: 配置速率限制
4. **定期更新**: 保持依赖包最新
5. **备份数据**: 定期备份数据库
6. **监控异常**: 设置日志监控和告警

## 支持

如有部署问题，请：
1. 查看本文档
2. 检查应用日志
3. 提交 GitHub Issue
4. 联系维护者

---

最后更新: 2024-01

