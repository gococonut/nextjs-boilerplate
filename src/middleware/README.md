# Middleware 架构说明

## 模块化结构

现在middleware被分解为多个独立的模块，每个模块负责不同的职责：

```
src/middleware/
├── admin.ts        # Admin API Token 验证
├── api.ts          # 普通 API 处理
├── intl.ts         # 国际化处理
└── auth.ts         # 认证辅助函数（用于API路由内部）
```

## 处理流程

主 `src/middleware.ts` 按优先级顺序调用不同的middleware：

1. **Admin API** (`/api/admin/*`) - 最高优先级
   - 验证 `Authorization: Bearer TOKEN`

   - 检查 `API_ACCESS_TOKEN` 环境变量

2. **普通 API** (`/api/*`) 
   - 处理非admin的API路由
   - 允许所有GET请求通过
   - 排除 `/api/auth` 路由

3. **国际化** (页面路由)
   - 处理前端页面的语言路由
   - 跳过所有API路由

## 各模块职责

### `admin.ts` - Admin API验证

* 检查Bearer token格式
* 验证token与环境变量匹配
* 返回详细的错误信息

### `api.ts` - 普通API处理

* 过滤API路由
* 允许GET请求直接通过
* 简化处理，避免Edge Runtime兼容性问题

### `intl.ts` - 国际化处理

* 包装 `next-intl` 的middleware
* 只处理页面路由
* 跳过API路由

### `auth.ts` - 认证工具

* 提供认证相关的辅助函数
* 用于API路由内部使用
* **不在middleware中使用**（避免Edge Runtime问题）

## 优势

1. **职责分离**: 每个模块只负责一个功能
2. **易于维护**: 可以独立修改各个模块
3. **性能优化**: 按路径类型分别处理，避免不必要的计算
4. **Edge Runtime兼容**: 避免在middleware中使用数据库相关代码

## 配置

所有middleware通过主配置文件的 `matcher` 统一管理：

```typescript
export const config = {
  matcher: [
    "/api/(.*)",                              // 所有API路由
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)" // 所有页面路由
  ],
};
```
