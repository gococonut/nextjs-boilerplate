import { NextRequest, NextResponse } from "next/server";
import { handleAPIError, APIError } from "./apiError";

/**
 * Admin API中间件 - 验证API访问令牌
 */
export async function adminMiddleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // 只处理admin API路由
    if (!pathname.startsWith("/api/admin/")) {
      return NextResponse.next();
    }

    // 获取Authorization头部
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new APIError("Missing or invalid authorization header", 401);
    }

    // 提取token
    const token = authHeader.substring(7); // 移除 "Bearer " 前缀
    const expectedToken = process.env.API_ACCESS_TOKEN;

    if (!expectedToken) {
      console.error("API_ACCESS_TOKEN environment variable is not set");
      throw new APIError("Server configuration error", 500);
    }

    if (token !== expectedToken) {
      throw new APIError("Invalid access token", 403);
    }

    // 验证通过，继续处理请求
    return NextResponse.next();
  } catch (error) {
    // 统一错误处理
    return handleAPIError(error, "Admin API access denied");
  }
}
