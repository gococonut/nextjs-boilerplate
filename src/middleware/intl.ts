import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// 创建国际化中间件
const intlHandler = createMiddleware(routing);

export async function intlMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只处理页面路由，跳过API路由
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 对于页面路由，使用国际化中间件
  return intlHandler(request);
}
