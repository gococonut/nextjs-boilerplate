import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  // 使用 PostgreSQL 数据库
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // 启用社交登录提供商
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // 配置 JWT 令牌
  session: {
    // 令牌过期时间 (7天)
    expiresIn: 60 * 60 * 24 * 7,
  },
  // 配置 cookie
  cookies: {
    // 设置为 true 以允许在 HTTP 中使用 cookie（开发环境）
    // 生产环境应设置为 false，只在 HTTPS 中使用
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});
