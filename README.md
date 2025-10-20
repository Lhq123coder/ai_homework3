# AI 旅行规划助手

基于人工智能的智能旅行规划系统，通过语音输入和大语言模型为用户生成个性化的旅行计划，并提供实时费用管理和地图导航功能。

## 📋 项目概述

AI 旅行规划助手是一款全栈 Web 应用，旨在简化旅行规划过程。通过集成语音识别、大语言模型、地图服务等技术，为用户提供智能化的旅行规划体验。

### 核心功能

1. **🎤 智能行程规划**
   - 支持语音和文字输入旅行需求
   - AI 自动生成详细的旅行路线
   - 包含交通、住宿、景点、餐厅等完整信息

2. **💰 费用预算与管理**
   - AI 智能预算分析
   - 实时费用记录（支持语音输入）
   - 预算使用情况可视化展示

3. **🗺️ 地图导航**
   - 高德地图集成
   - 行程路线可视化
   - 景点位置标注

4. **👤 用户管理与数据存储**
   - 完整的注册登录系统
   - 云端行程同步（Supabase）
   - 多设备数据同步

## 🛠️ 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **状态管理**: Zustand
- **路由**: React Router v6
- **样式**: CSS-in-JS (内联样式)
- **地图**: 高德地图 API
- **语音识别**: Web Speech API

### 后端
- **运行时**: Node.js 20
- **框架**: Express.js + TypeScript
- **身份认证**: JWT
- **密码加密**: bcrypt
- **数据库**: PostgreSQL (Supabase)
- **ORM/客户端**: Supabase Client

### AI 服务
- **大语言模型**: 阿里云通义千问 (DashScope API)
- **用途**: 行程规划、费用分析

### 部署
- **容器化**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: 阿里云容器镜像服务

## 📦 项目结构

```
ai-travel-planner/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # React 组件
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API 服务
│   │   ├── store/           # 状态管理
│   │   ├── hooks/           # 自定义 Hooks
│   │   ├── App.tsx          # 根组件
│   │   └── main.tsx         # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # 后端应用
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── middleware/      # 中间件
│   │   ├── config/          # 配置文件
│   │   └── index.ts         # 入口文件
│   ├── package.json
│   └── tsconfig.json
├── database/                 # 数据库脚本
│   └── schema.sql           # 数据库模式
├── .github/workflows/        # GitHub Actions
│   ├── ci.yml               # 持续集成
│   └── docker-build.yml     # Docker 构建和推送
├── Dockerfile.backend        # 后端 Docker 配置
├── Dockerfile.frontend       # 前端 Docker 配置
├── docker-compose.yml        # Docker Compose 配置
├── nginx.conf               # Nginx 配置
└── README.md                # 项目文档
```

## 🚀 快速开始

### 前置要求

- Node.js 20+ 和 npm
- Docker 和 Docker Compose（用于容器化部署）
- Supabase 账号（免费）
- 阿里云 DashScope API Key（可选，用于 AI 功能）
- 高德地图 API Key（可选，用于地图功能）

### 环境配置

#### 1. Supabase 配置

1. 访问 [Supabase](https://supabase.com) 创建免费账号
2. 创建新项目
3. 在 SQL 编辑器中运行 `database/schema.sql` 脚本
4. 获取项目 URL 和 Service Key（在 Settings > API）

#### 2. 阿里云 DashScope API（通义千问）

1. 访问 [阿里云百炼平台](https://dashscope.console.aliyun.com/)
2. 开通服务并获取 API Key
3. 建议：使用通义千问 Max 模型以获得最佳效果

**助教专用 API Key（有效期3个月）**: `sk-xxxxxxxxxxxxxxxxxxxxx`
（此处应填入实际的 API Key，仅供作业批改使用）

#### 3. 高德地图 API Key

1. 访问 [高德开放平台](https://console.amap.com/)
2. 注册并创建应用
3. 获取 Web 服务 API Key

### 本地开发

#### 方式一：使用 Docker Compose（推荐）

1. 克隆仓库
```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
```

2. 配置环境变量
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入您的配置
nano .env
```

3. 启动服务
```bash
docker-compose up -d
```

4. 访问应用
- 前端: http://localhost
- 后端 API: http://localhost:3000

#### 方式二：手动运行

1. 安装依赖
```bash
# 安装根目录依赖
npm install

# 安装前后端依赖
cd frontend && npm install
cd ../backend && npm install
```

2. 配置环境变量
```bash
# 后端环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env

# 前端环境变量
cp frontend/.env.example frontend/.env
# 编辑 frontend/.env
```

3. 启动开发服务器
```bash
# 在项目根目录
npm run dev

# 或分别启动
npm run dev:backend  # 后端: http://localhost:3000
npm run dev:frontend # 前端: http://localhost:5173
```

### 生产部署

#### 使用 Docker Compose

```bash
# 构建并启动
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 使用预构建的 Docker 镜像

如果您已经将镜像推送到阿里云容器镜像服务：

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest

# 运行容器
docker run -d -p 3000:3000 \
  -e JWT_SECRET=your-secret \
  -e SUPABASE_URL=your-url \
  -e SUPABASE_SERVICE_KEY=your-key \
  -e DASHSCOPE_API_KEY=your-key \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest

docker run -d -p 80:80 \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest
```

## 📖 使用说明

### 1. 注册账户

1. 访问应用首页
2. 点击"立即注册"
3. 填写姓名、邮箱和密码

### 2. 规划行程

#### 方式一：表单输入

1. 点击"规划新行程"
2. 填写旅行信息：
   - 目的地
   - 出发和结束日期
   - 预算
   - 同行人数
   - 旅行偏好

#### 方式二：语音输入（推荐）

1. 点击"开始语音输入"按钮
2. 说出您的需求，例如：
   > "我想去日本东京，5天，预算1万元，喜欢美食和动漫，2个人"
3. 系统自动识别并填充表单

#### 生成行程

点击"生成行程计划"，AI 将在几秒钟内为您生成：
- 每日详细行程安排
- 景点推荐和时间规划
- 住宿建议
- 交通方案
- 预算分配
- 旅行贴士

### 3. 查看行程详情

在行程详情页面，您可以：

**行程安排标签**
- 查看每日详细活动
- 查看住宿和交通建议
- 阅读 AI 生成的旅行贴士

**地图导航标签**
- 在高德地图上查看所有景点位置
- 查看行程路线
- 点击标记查看详细信息

**费用管理标签**
- 查看预算使用情况
- 添加支出记录（支持语音输入）
- 查看分类统计
- 实时预算提醒

### 4. 费用管理

#### 添加支出（表单输入）

1. 点击"添加支出记录"
2. 选择类别（住宿、交通、餐饮等）
3. 输入金额和描述
4. 选择日期

#### 添加支出（语音输入）

1. 点击"开始语音输入"
2. 说出支出信息，例如：
   > "午餐花了80元"
3. 系统自动识别金额和描述

## 🔧 API 文档

### 认证 API

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 行程 API

所有行程 API 需要在请求头中包含 JWT Token：
```http
Authorization: Bearer <token>
```

#### 获取所有行程
```http
GET /api/trips
```

#### 获取单个行程
```http
GET /api/trips/:id
```

#### 创建行程
```http
POST /api/trips
Content-Type: application/json

{
  "destination": "东京",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "budget": 10000,
  "travelers": 2,
  "preferences": "喜欢美食和文化",
  "itinerary": { /* AI生成的行程 */ },
  "expenses": []
}
```

#### 更新行程
```http
PUT /api/trips/:id
Content-Type: application/json

{
  /* 更新的字段 */
}
```

#### 删除行程
```http
DELETE /api/trips/:id
```

### AI API

#### 生成行程
```http
POST /api/ai/generate-itinerary
Content-Type: application/json
Authorization: Bearer <token>

{
  "destination": "东京",
  "days": 5,
  "budget": 10000,
  "travelers": 2,
  "preferences": "喜欢美食和文化"
}
```

#### 分析费用
```http
POST /api/ai/analyze-expenses
Content-Type: application/json
Authorization: Bearer <token>

{
  "expenses": [ /* 费用列表 */ ],
  "budget": 10000
}
```

## 🔐 安全性

- 密码使用 bcrypt 加密存储
- JWT Token 用于身份验证
- API 路由受中间件保护
- Supabase Row Level Security (RLS) 确保数据隔离
- 环境变量存储敏感信息
- HTTPS 推荐用于生产环境

## 🤝 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发日志

- **2024-01**: 项目初始化，完成基础架构设计
- **2024-01**: 实现用户认证系统
- **2024-01**: 集成语音识别功能
- **2024-01**: 集成阿里云通义千问 API
- **2024-01**: 实现行程规划核心功能
- **2024-01**: 集成高德地图服务
- **2024-01**: 实现费用管理功能
- **2024-01**: Docker 化部署
- **2024-01**: GitHub Actions CI/CD 配置

## 📄 许可证

本项目仅用于学术目的。

## 👨‍💻 作者

- 姓名：[您的姓名]
- 学号：[您的学号]
- 邮箱：[您的邮箱]
- GitHub: [您的 GitHub 主页]

## 🙏 致谢

- 阿里云通义千问提供的强大 AI 能力
- Supabase 提供的便捷后端服务
- 高德地图提供的地图服务
- React 和 Node.js 社区

## 📞 支持

如有问题，请：
1. 查看本文档
2. 提交 Issue
3. 联系作者

---

**注意**：本项目为研究生课程作业项目，持续更新中。

