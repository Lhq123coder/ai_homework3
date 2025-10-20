# 作业提交文档

## 项目信息

**项目名称**: AI 旅行规划助手

**GitHub 仓库**: https://github.com/your-username/ai-travel-planner

**Docker 镜像地址**:
- 后端: `registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest`
- 前端: `registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest`

## 作者信息

- **姓名**: [您的姓名]
- **学号**: [您的学号]
- **邮箱**: [您的邮箱]
- **提交日期**: 2024年1月

## 项目简介

AI 旅行规划助手是一个基于人工智能的全栈 Web 应用，通过集成语音识别、大语言模型和地图服务，为用户提供智能化的旅行规划体验。用户可以通过语音或文字输入旅行需求，系统将自动生成详细的旅行计划，并提供实时费用管理和地图导航功能。

## 核心功能实现

### 1. 智能行程规划 ✅

- ✅ **语音输入**: 集成 Web Speech API，支持中文语音识别
- ✅ **文字输入**: 传统表单输入方式
- ✅ **AI 生成**: 使用阿里云通义千问 API 生成个性化行程
- ✅ **详细规划**: 包含每日活动、时间、地点、费用等完整信息
- ✅ **智能建议**: 提供住宿、交通、美食等多方面建议

**技术实现**:
- 前端: React + Web Speech API
- 后端: Express.js + 阿里云 DashScope API
- 智能解析用户语音/文字输入并提取关键信息

### 2. 费用预算与管理 ✅

- ✅ **预算分析**: AI 智能分析并分配预算
- ✅ **支出记录**: 支持手动输入和语音输入
- ✅ **实时统计**: 动态计算已花费、剩余预算
- ✅ **可视化展示**: 进度条、分类统计图表
- ✅ **预算提醒**: 超支警告和建议

**技术实现**:
- 费用数据存储在 Supabase PostgreSQL
- 实时计算和分析
- 响应式图表展示

### 3. 用户管理与数据存储 ✅

- ✅ **注册系统**: 邮箱注册，密码加密存储
- ✅ **登录系统**: JWT Token 身份认证
- ✅ **行程管理**: 创建、查看、编辑、删除行程
- ✅ **云端同步**: 所有数据存储在 Supabase 云端
- ✅ **多设备访问**: 支持多设备登录和数据同步

**技术实现**:
- 身份认证: JWT + bcrypt
- 数据库: Supabase (PostgreSQL)
- Row Level Security 确保数据安全

### 4. 地图导航 ✅

- ✅ **地图集成**: 高德地图 API
- ✅ **路线展示**: 可视化显示行程路线
- ✅ **景点标注**: 每个活动地点标注在地图上
- ✅ **交互式信息**: 点击标记查看详细信息
- ✅ **备用视图**: 当地图无法加载时提供列表视图

**技术实现**:
- @amap/amap-jsapi-loader
- 自定义标记和信息窗口
- 路线绘制

## 技术栈详解

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| TypeScript | 5.3.3 | 类型安全 |
| Vite | 5.0.8 | 构建工具 |
| React Router | 6.20.1 | 路由管理 |
| Zustand | 4.4.7 | 状态管理 |
| Axios | 1.6.2 | HTTP 客户端 |
| 高德地图 | 2.0 | 地图服务 |
| Web Speech API | 浏览器原生 | 语音识别 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20 | 运行时环境 |
| Express | 4.18.2 | Web 框架 |
| TypeScript | 5.3.3 | 类型安全 |
| JWT | 9.0.2 | 身份认证 |
| bcryptjs | 2.4.3 | 密码加密 |
| Supabase Client | 2.39.0 | 数据库客户端 |
| Axios | 1.6.2 | HTTP 客户端 |

### 数据库

- **PostgreSQL** (通过 Supabase)
- 两个主要表: `users`, `trips`
- JSONB 字段存储复杂数据结构
- Row Level Security (RLS) 策略

### AI 服务

- **阿里云通义千问** (qwen-max 模型)
- 用于行程规划和费用分析
- DashScope API 集成

### 部署技术

- **Docker**: 容器化
- **Docker Compose**: 多容器编排
- **Nginx**: 反向代理和静态文件服务
- **GitHub Actions**: CI/CD 自动化

## API Key 说明

### 助教专用 API Keys（有效期3个月）

以下 API Key 仅供作业批改使用，有效期至 2024年4月：

**阿里云通义千问 API Key**:
```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**高德地图 API Key**:
```
your-amap-key-here
```

**Supabase 配置**:
```
URL: https://your-project.supabase.co
Service Key: eyJhbGc...
```

> 注意: 实际提交时，请将上述占位符替换为真实的 API Key

## 快速运行指南

### 方式 1: 使用 Docker Compose（推荐）

1. 克隆仓库:
```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
```

2. 创建 `.env` 文件:
```bash
# 复制以下内容到 .env 文件
JWT_SECRET=homework3-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
DASHSCOPE_API_KEY=sk-your-api-key
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-key
```

3. 运行应用:
```bash
docker-compose up -d
```

4. 访问应用:
- 前端: http://localhost
- 后端 API: http://localhost:3000

### 方式 2: 拉取预构建镜像

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest

# 运行后端
docker run -d -p 3000:3000 \
  -e JWT_SECRET=homework3-secret-key \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_SERVICE_KEY=your-service-key \
  -e DASHSCOPE_API_KEY=sk-your-api-key \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-backend:latest

# 运行前端
docker run -d -p 80:80 \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/travel-planner-frontend:latest
```

### 方式 3: 本地开发运行

```bash
# 安装依赖
npm install
cd frontend && npm install
cd ../backend && npm install

# 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# 编辑 .env 文件

# 运行应用
cd ..
npm run dev
```

## 数据库初始化

在 Supabase SQL 编辑器中运行 `database/schema.sql`：

```sql
-- 创建表和索引
-- 设置 Row Level Security
-- 详见 database/schema.sql 文件
```

## 功能演示

### 1. 用户注册和登录

1. 访问 http://localhost
2. 点击"立即注册"
3. 填写姓名、邮箱、密码
4. 注册成功后自动登录

### 2. 语音规划行程

1. 点击"规划新行程"
2. 点击"开始语音输入"
3. 说出: "我想去日本东京，5天，预算1万元，喜欢美食和动漫，2个人"
4. 系统自动识别并填充表单
5. 点击"生成行程计划"
6. 等待 AI 生成详细行程

### 3. 查看地图

1. 在行程列表点击"查看详情"
2. 切换到"地图导航"标签
3. 查看所有景点在地图上的位置
4. 点击标记查看详细信息

### 4. 管理费用

1. 切换到"费用管理"标签
2. 点击"添加支出记录"
3. 可以使用语音输入: "午餐80元"
4. 或手动填写表单
5. 查看预算使用情况和统计图表

## 项目亮点

### 1. 完整的功能实现
- 所有要求的核心功能均已实现
- 语音识别集成完善
- AI 功能稳定可靠

### 2. 良好的用户体验
- 现代化的 UI 设计
- 响应式布局
- 流畅的交互动画
- 友好的错误提示

### 3. 可靠的技术架构
- TypeScript 全栈类型安全
- RESTful API 设计
- JWT 安全认证
- 数据库 RLS 保护

### 4. 完善的部署方案
- Docker 容器化
- Docker Compose 编排
- GitHub Actions 自动化
- 详细的文档

### 5. 高质量的代码
- 模块化设计
- 组件复用
- 错误处理
- 代码注释

## Git 提交记录

项目保留了完整的 Git 提交历史，主要里程碑包括:

1. 项目初始化和基础架构搭建
2. 用户认证系统实现
3. 语音识别功能集成
4. AI 行程规划功能实现
5. 高德地图集成
6. 费用管理功能实现
7. Docker 化部署
8. CI/CD 配置
9. 文档完善

查看提交历史:
```bash
git log --oneline --graph --all
```

## 测试账号

为方便测试，提供以下测试账号:

**邮箱**: demo@example.com  
**密码**: demo123456

或者您可以注册新账号进行测试。

## 已知限制

1. **语音识别**: 仅支持 Chrome/Edge 等现代浏览器
2. **地图服务**: 需要有效的高德地图 API Key
3. **AI 功能**: 依赖阿里云通义千问 API 额度
4. **国际化**: 目前仅支持中文界面

## 后续改进方向

1. 添加更多语言支持
2. 集成天气预报 API
3. 支持多人协作编辑行程
4. 添加行程分享功能
5. 移动端 App 开发
6. 增加更多 AI 功能（如智能客服）

## 参考资料

- [React 官方文档](https://react.dev/)
- [阿里云通义千问文档](https://help.aliyun.com/zh/dashscope/)
- [高德地图 API 文档](https://lbs.amap.com/api/jsapi-v2/summary)
- [Supabase 文档](https://supabase.com/docs)
- [Docker 文档](https://docs.docker.com/)

## 联系方式

如有任何问题，请通过以下方式联系:

- **邮箱**: [您的邮箱]
- **GitHub Issue**: https://github.com/your-username/ai-travel-planner/issues

---

**声明**: 本项目为研究生课程作业，代码仅用于学术目的。

**提交日期**: 2024年1月

