# 快速开始指南

本指南将帮助您在 5 分钟内运行 AI 旅行规划助手。

## 🚀 最快方式：使用 Docker Compose

### 前置要求
- Docker
- Docker Compose

### 步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
```

2. **配置环境变量**
创建 `.env` 文件（或使用提供的测试配置）:
```bash
cat > .env << 'EOF'
JWT_SECRET=homework3-demo-secret-key-2024
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
DASHSCOPE_API_KEY=sk-your-dashscope-api-key
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-key
EOF
```

3. **启动服务**
```bash
docker-compose up -d
```

4. **访问应用**
- 前端: http://localhost
- 后端: http://localhost:3000

就这么简单！ 🎉

## 💻 本地开发方式

### 前置要求
- Node.js 20+
- npm

### 步骤

1. **克隆并安装**
```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner

# 使用自动化脚本
# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh

# Windows
scripts\setup.bat
```

2. **配置环境**
```bash
# 后端配置
cp backend/.env.example backend/.env
# 编辑 backend/.env

# 前端配置
cp frontend/.env.example frontend/.env
# 编辑 frontend/.env
```

3. **启动开发服务器**
```bash
npm run dev
```

访问:
- 前端: http://localhost:5173
- 后端: http://localhost:3000

## 🗄️ 数据库设置

### 使用 Supabase（推荐）

1. 访问 [supabase.com](https://supabase.com)
2. 创建免费账号
3. 创建新项目
4. 在 SQL 编辑器中运行 `database/schema.sql`
5. 获取项目 URL 和 Service Key（Settings > API）
6. 更新 `.env` 文件

## 🔑 获取 API Keys

### 1. 阿里云通义千问 (必需，用于 AI 功能)

1. 访问 [DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 登录/注册阿里云账号
3. 开通 DashScope 服务
4. 创建 API Key
5. 复制 Key 到 `.env` 的 `DASHSCOPE_API_KEY`

**助教测试用 Key**（有效期至2024年4月）:
```
sk-provided-for-homework-testing-only
```

### 2. 高德地图 (可选，用于地图功能)

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册/登录
3. 创建应用
4. 获取 Web 服务 Key
5. 复制 Key 到 `.env` 的 `VITE_AMAP_KEY`

如果不配置，地图功能将显示备用列表视图。

## 📝 测试功能

### 1. 注册账户
- 访问 http://localhost（或 :5173 开发模式）
- 点击"立即注册"
- 填写姓名、邮箱、密码

### 2. 规划行程

#### 使用语音（推荐）
1. 点击"规划新行程"
2. 点击"开始语音输入"按钮
3. 说出: "我想去日本东京，5天，预算1万元，喜欢美食和动漫，2个人"
4. 系统自动填充表单
5. 点击"生成行程计划"

#### 使用表单
1. 点击"规划新行程"
2. 填写目的地、日期、预算等信息
3. 点击"生成行程计划"

### 3. 查看行程
- 在行程列表点击"查看详情"
- 切换标签查看：行程安排、地图导航、费用管理

### 4. 管理费用
1. 在行程详情页切换到"费用管理"
2. 点击"添加支出记录"
3. 可以语音输入："午餐80元"
4. 或手动填写表单

## ⚠️ 常见问题

### Docker 相关

**问题**: 容器启动失败
```bash
# 查看日志
docker-compose logs

# 重新构建
docker-compose up --build
```

**问题**: 端口占用
```bash
# 修改 docker-compose.yml 中的端口映射
# 例如: "8080:80" 替换 "80:80"
```

### 开发模式

**问题**: 前端无法连接后端
- 检查后端是否运行: http://localhost:3000/api/health
- 检查 `frontend/.env` 中的 `VITE_API_URL`
- 清除浏览器缓存

**问题**: npm install 失败
```bash
# 清除缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 功能相关

**问题**: 语音识别不工作
- 使用 Chrome/Edge 浏览器
- 确保使用 HTTPS 或 localhost
- 允许麦克风权限

**问题**: AI 不生成行程
- 检查 `DASHSCOPE_API_KEY` 是否正确
- 查看后端日志
- 确认 API 有足够额度

**问题**: 地图不显示
- 检查 `VITE_AMAP_KEY` 是否正确
- 将显示备用列表视图

## 📚 下一步

- 阅读 [README.md](README.md) 了解完整功能
- 查看 [DEPLOYMENT.md](DEPLOYMENT.md) 了解部署细节
- 阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 参与贡献

## 🆘 需要帮助？

- 📖 查看文档
- 🐛 提交 [Issue](https://github.com/your-username/ai-travel-planner/issues)
- 💬 查看 [FAQ](README.md#常见问题)

---

祝您使用愉快！✈️🌍

