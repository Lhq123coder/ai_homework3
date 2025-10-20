# 贡献指南

感谢您对 AI 旅行规划助手项目的关注！

## 开发环境设置

### 前置要求

- Node.js 20+
- npm 或 yarn
- Git

### 克隆仓库

```bash
git clone https://github.com/your-username/ai-travel-planner.git
cd ai-travel-planner
```

### 安装依赖

**方式 1: 使用设置脚本**

Linux/Mac:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Windows:
```bash
scripts\setup.bat
```

**方式 2: 手动安装**

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 配置环境变量

1. 后端配置:
```bash
cp backend/.env.example backend/.env
```

编辑 `backend/.env` 并填入您的配置。

2. 前端配置:
```bash
cp frontend/.env.example frontend/.env
```

编辑 `frontend/.env` 并填入您的配置。

### 启动开发服务器

```bash
# 在项目根目录
npm run dev
```

这将同时启动前端和后端开发服务器：
- 前端: http://localhost:5173
- 后端: http://localhost:3000

## 项目结构

```
ai-travel-planner/
├── frontend/          # React 前端应用
├── backend/           # Express 后端应用
├── database/          # 数据库脚本
├── scripts/           # 工具脚本
└── .github/           # GitHub Actions 配置
```

## 开发工作流

1. **创建新分支**
```bash
git checkout -b feature/your-feature-name
```

2. **进行开发**
   - 编写代码
   - 测试功能
   - 确保代码质量

3. **提交更改**
```bash
git add .
git commit -m "feat: add new feature"
```

4. **推送到远程**
```bash
git push origin feature/your-feature-name
```

5. **创建 Pull Request**
   - 在 GitHub 上创建 PR
   - 描述您的更改
   - 等待审核

## 代码规范

### TypeScript

- 使用 TypeScript 进行类型安全开发
- 定义清晰的接口和类型
- 避免使用 `any` 类型

### React 组件

- 使用函数组件和 Hooks
- 组件命名使用 PascalCase
- 将复杂逻辑提取到自定义 Hooks

### 命名规范

- 文件名: `kebab-case.tsx`
- 组件名: `PascalCase`
- 函数名: `camelCase`
- 常量: `UPPER_SNAKE_CASE`

### 提交信息

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建/工具相关

示例:
```
feat: add voice recognition for expense tracking
fix: resolve map loading issue
docs: update README with new features
```

## 测试

### 前端测试

```bash
cd frontend
npm run test
```

### 后端测试

```bash
cd backend
npm run test
```

## 构建

### 前端构建

```bash
cd frontend
npm run build
```

构建输出在 `frontend/dist/`

### 后端构建

```bash
cd backend
npm run build
```

构建输出在 `backend/dist/`

## Docker

### 构建镜像

```bash
# 后端
docker build -f Dockerfile.backend -t travel-planner-backend .

# 前端
docker build -f Dockerfile.frontend -t travel-planner-frontend .
```

### 运行容器

```bash
docker-compose up
```

## 常见问题

### 1. 依赖安装失败

**解决方案**: 清除 npm 缓存并重新安装
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. TypeScript 类型错误

**解决方案**: 重新生成类型定义
```bash
cd frontend && npm run build
cd ../backend && npm run build
```

### 3. 端口冲突

**解决方案**: 修改端口配置
- 前端: 编辑 `frontend/vite.config.ts`
- 后端: 修改 `backend/.env` 中的 `PORT`

## 需要帮助？

- 📖 查看 [README.md](README.md)
- 📖 查看 [DEPLOYMENT.md](DEPLOYMENT.md)
- 🐛 提交 [Issue](https://github.com/your-username/ai-travel-planner/issues)
- 💬 发起 [Discussion](https://github.com/your-username/ai-travel-planner/discussions)

## 行为准则

请遵守以下准则：

1. 尊重所有贡献者
2. 接受建设性批评
3. 专注于对项目最有利的事情
4. 友好待人

## 许可证

通过贡献，您同意您的贡献将在 MIT 许可证下授权。

