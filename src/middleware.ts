import type { NextRequest } from "next/server";
import { adminMiddleware } from "./middleware/admin";
import { apiMiddleware } from "./middleware/api";
import { intlMiddleware } from "./middleware/intl";
import { handleAPIError } from "./middleware/apiError";

export default async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // 1. Admin API 路由处理 - 最高优先级
    if (pathname.startsWith("/api/admin/")) {
      return await adminMiddleware(request);
    }

    // 2. 其他 API 路由处理
    if (pathname.startsWith("/api/")) {
      return await apiMiddleware(request);
    }

    // 3. 页面路由的国际化处理
    return await intlMiddleware(request);
  } catch (error) {
    // 全局错误处理 - 只对API路由生效
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return handleAPIError(error, "API request failed");
    }
    // 非API路由的错误继续抛出
    throw error;
  }
}

export const config = {
  // 匹配所有路径，包括API路由和页面路由
  matcher: [
    // 匹配所有API路由
    "/api/(.*)",
    // 匹配所有页面路径，除了以下开头的：
    // - `/api`, `/trpc`, `/_next` 或 `/_vercel`
    // - 包含点的文件 (e.g. `favicon.ico`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
