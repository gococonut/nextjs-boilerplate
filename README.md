# Next.js 开发模板

一个基于 Next.js 15 的现代化开发模板，包含以下特性：

## 🚀 技术栈

* **Next.js 15** - React 框架
* **TypeScript** - 类型安全
* **Tailwind CSS** - 样式框架
* **daisyUI** - UI 组件库
* **next-intl** - 国际化支持
* **better-auth** - 认证系统
* **Prisma** - 数据库 ORM
* **PostgreSQL** - 数据库

## 📦 已包含功能

* ✅ 国际化 (中文、英文、日文、韩文、繁体中文)
* ✅ 用户认证 (GitHub、Google 登录)
* ✅ 响应式导航栏
* ✅ 主题切换 (明亮/暗黑/跟随系统)
* ✅ 中间件系统 (认证、API、国际化)
* ✅ API 路由结构
* ✅ 错误处理
* ✅ TypeScript 配置
* ✅ ESLint & Prettier

## 🛠️ 开发环境设置

1. **克隆项目**
   

```bash
   git clone <repository-url>
   cd <project-name>
   ```

2. **安装依赖**
   

```bash
   yarn install
   ```

3. **环境变量配置**
   创建 `.env.local` 文件：
   

```env
   # 数据库连接
   DATABASE_URL="postgresql://username:password@localhost:5432/database"
   
   # GitHub OAuth
   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

4. **数据库设置**
   

```bash
   # 生成 Prisma 客户端
   yarn db:generate
   
   # 运行数据库迁移
   yarn db:migrate
   ```

5. **启动开发服务器**
   

```bash
   yarn dev
   ```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 首页
│   ├── api/               # API 路由
│   │   └── auth/          # 认证 API
│   └── globals.css        # 全局样式
├── components/            # 通用组件
├── context/              # React Context
├── hooks/                # 自定义 Hooks
├── i18n/                 # 国际化配置
├── lib/                  # 工具库
├── middleware/           # 中间件
├── styles/               # 样式文件
└── types/                # TypeScript 类型定义
```

## 🔧 可用脚本

* `yarn dev` - 启动开发服务器
* `yarn build` - 构建生产版本
* `yarn start` - 启动生产服务器
* `yarn lint` - 运行 ESLint
* `yarn typecheck` - 类型检查
* `yarn db:generate` - 生成 Prisma 客户端
* `yarn db:migrate` - 运行数据库迁移

## 🌐 国际化

支持的语言：
* English (en)
* 简体中文 (zh)
* 繁体中文 (zh-TW)
* 日本語 (ja)
* 한국어 (ko)

语言文件位于 `messages/` 目录。

## 🔐 认证

使用 better-auth 提供：
* GitHub 登录
* Google 登录
* 会话管理
* 受保护的路由

## 🎨 样式

* Tailwind CSS 用于样式
* daisyUI 提供组件
* 支持明亮/暗黑主题
* 响应式设计

## 📱 部署

项目配置为 standalone 输出，可以部署到：
* Vercel
* Railway
* 自有服务器

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
# nextjs-boilerplate
