import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 如果 API 路由位于相同域名下，则不需要提供 baseURL
  // 如果使用了不同的 API 路由路径，可以指定 baseURL

  // 添加性能优化配置
  fetchOptions: {
    // 添加请求超时
    timeout: 10000, // 10秒超时
  },

  // 配置会话管理
  session: {
    // 减少会话检查频率
    cookieCache: true,
  },
});
