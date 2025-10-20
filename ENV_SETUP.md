# 环境变量配置详解

本文档详细说明所有环境变量的配置方法和说明。

## 📋 概览

项目使用环境变量来管理敏感信息和配置。主要分为后端环境变量和前端环境变量。

## 🔧 后端环境变量

文件位置: `backend/.env`

### 必需变量

#### PORT
- **说明**: 后端服务器端口
- **默认值**: `3000`
- **示例**: `PORT=3000`

#### NODE_ENV
- **说明**: 运行环境
- **可选值**: `development`, `production`, `test`
- **默认值**: `development`
- **示例**: `NODE_ENV=production`

#### JWT_SECRET
- **说明**: JWT Token 签名密钥
- **重要**: ⚠️ 生产环境必须更改！
- **要求**: 至少 32 字符的随机字符串
- **生成方法**:
```bash
# 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 使用 OpenSSL
openssl rand -hex 32
```
- **示例**: `JWT_SECRET=a1b2c3d4e5f6...`

#### SUPABASE_URL
- **说明**: Supabase 项目 URL
- **获取方法**:
  1. 登录 [Supabase](https://supabase.com)
  2. 选择项目
  3. Settings > API > Project URL
- **格式**: `https://xxxxx.supabase.co`
- **示例**: `SUPABASE_URL=https://abcdefgh.supabase.co`

#### SUPABASE_SERVICE_KEY
- **说明**: Supabase 服务密钥（Service Role Key）
- **重要**: ⚠️ 不要暴露在前端！
- **获取方法**:
  1. 登录 Supabase
  2. 选择项目
  3. Settings > API > Service role key
  4. 点击"Reveal"查看
- **格式**: 长字符串（JWT 格式）
- **示例**: `SUPABASE_SERVICE_KEY=eyJhbGc...`

#### DASHSCOPE_API_KEY
- **说明**: 阿里云通义千问 API Key
- **用途**: AI 行程规划和分析
- **获取方法**:
  1. 访问 [DashScope 控制台](https://dashscope.console.aliyun.com/)
  2. 登录/注册
  3. 开通服务
  4. 创建 API Key
- **格式**: `sk-` 开头的字符串
- **示例**: `DASHSCOPE_API_KEY=sk-abcd1234...`

### 可选变量

#### DASHSCOPE_MODEL
- **说明**: 使用的模型名称
- **默认值**: `qwen-max`
- **可选值**: `qwen-max`, `qwen-plus`, `qwen-turbo`
- **示例**: `DASHSCOPE_MODEL=qwen-max`

### 完整示例

```bash
# backend/.env
PORT=3000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars-long-please-change-this
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DASHSCOPE_API_KEY=sk-your-dashscope-api-key-here
```

## 🎨 前端环境变量

文件位置: `frontend/.env`

### 必需变量

#### VITE_API_URL
- **说明**: 后端 API 基础 URL
- **开发环境**: `http://localhost:3000/api`
- **生产环境**: `https://your-domain.com/api`
- **注意**: Vite 要求环境变量以 `VITE_` 开头才能在前端使用
- **示例**: `VITE_API_URL=http://localhost:3000/api`

### 可选变量

#### VITE_AMAP_KEY
- **说明**: 高德地图 API Key
- **用途**: 地图导航功能
- **获取方法**:
  1. 访问 [高德开放平台](https://console.amap.com/)
  2. 登录/注册
  3. 创建应用（应用类型：Web 端）
  4. 获取 Key
- **不配置的影响**: 地图功能将显示备用列表视图
- **示例**: `VITE_AMAP_KEY=your-amap-key-here`

### 完整示例

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-web-key
```

## 🐳 Docker 环境变量

文件位置: 项目根目录 `.env`（用于 docker-compose）

Docker Compose 会读取根目录的 `.env` 文件并传递给容器。

```bash
# .env (for docker-compose)
# Backend variables
JWT_SECRET=your-jwt-secret
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
DASHSCOPE_API_KEY=sk-your-key

# Frontend variables (build time)
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-key
```

## 🔒 安全最佳实践

### 1. 永远不要提交 .env 文件

`.env` 文件已添加到 `.gitignore`，确保不会被提交到版本控制。

### 2. 使用强密钥

```bash
# 生成强 JWT 密钥
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. 不同环境使用不同密钥

- 开发环境: 可以使用简单的测试密钥
- 生产环境: 必须使用强随机密钥

### 4. 定期轮换密钥

建议每 90 天更换一次 JWT_SECRET 和 API Keys。

### 5. 限制 API Key 权限

- Supabase: 使用 Service Role Key（仅后端）
- 高德地图: 设置 IP 白名单或域名限制

## 🧪 测试环境配置

### 本地开发（最小配置）

如果只想测试基本功能，可以使用以下最小配置：

```bash
# backend/.env
PORT=3000
NODE_ENV=development
JWT_SECRET=local-dev-secret-not-for-production
SUPABASE_URL=https://demo.supabase.co
SUPABASE_SERVICE_KEY=demo-key
# DASHSCOPE_API_KEY 可选，不配置将使用模拟数据
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:3000/api
# VITE_AMAP_KEY 可选，不配置将显示列表视图
```

### 助教测试配置

**用于作业批改的临时配置（有效期至 2024年4月）**：

```bash
# 阿里云通义千问
DASHSCOPE_API_KEY=sk-[provided-in-submission]

# 高德地图
VITE_AMAP_KEY=[provided-in-submission]

# Supabase（共享测试数据库）
SUPABASE_URL=[provided-in-submission]
SUPABASE_SERVICE_KEY=[provided-in-submission]
```

> 注意：实际的 Keys 会在 SUBMISSION.md 中提供

## 🔍 验证配置

### 检查后端配置

```bash
# 测试后端连接
curl http://localhost:3000/api/health

# 预期响应
{"status":"ok","message":"AI Travel Planner API is running"}
```

### 检查前端配置

1. 打开浏览器控制台
2. 检查 API 请求是否正确发送到后端
3. 检查是否有 CORS 错误

### 检查 Supabase 连接

```bash
# 在后端代码中添加测试
# backend/src/test-supabase.ts
import { supabase } from './config/supabase';

async function testConnection() {
  const { data, error } = await supabase.from('users').select('count');
  if (error) {
    console.error('Supabase connection failed:', error);
  } else {
    console.log('Supabase connected successfully!');
  }
}

testConnection();
```

## 📝 模板文件

### backend/.env.example

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key
DASHSCOPE_API_KEY=your-dashscope-api-key
```

### frontend/.env.example

```bash
VITE_API_URL=http://localhost:3000/api
VITE_AMAP_KEY=your-amap-key
```

## ❓ 常见问题

### Q: 为什么我的 .env 文件不生效？

**A**: 
1. 检查文件名是否正确（`.env` 不是 `env.txt`）
2. 重启开发服务器
3. 确认变量名拼写正确
4. 前端变量必须以 `VITE_` 开头

### Q: 如何在代码中使用环境变量？

**A**:
```typescript
// 后端 (Node.js)
const apiKey = process.env.DASHSCOPE_API_KEY;

// 前端 (Vite)
const apiUrl = import.meta.env.VITE_API_URL;
```

### Q: 生产环境如何配置环境变量？

**A**:
- Docker: 使用 `.env` 文件或 `-e` 参数
- Vercel/Netlify: 在平台设置中配置
- 服务器: 设置系统环境变量

### Q: 可以不使用某些 API Keys 吗？

**A**: 
- `DASHSCOPE_API_KEY`: 可选，不配置将使用模拟数据
- `VITE_AMAP_KEY`: 可选，不配置将显示列表视图
- `SUPABASE_*`: 必需，用于数据存储和认证

## 🔗 相关链接

- [Supabase 文档](https://supabase.com/docs)
- [阿里云 DashScope](https://help.aliyun.com/zh/dashscope/)
- [高德地图 API](https://lbs.amap.com/api/)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)

---

如有疑问，请查看 [README.md](README.md) 或提交 Issue。

