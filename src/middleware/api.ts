import { NextRequest, NextResponse } from "next/server";
import { handleAPIError } from "./apiError";

/**
 * 普通API中间件 - 处理非admin API路由
 */
export async function apiMiddleware(request: NextRequest) {
  try {
    // 对于普通API，目前只是简单放行
    // 未来可以在这里添加通用的API处理逻辑，如：
    // - 请求日志
    // - 速率限制
    // - 通用认证检查
    // - 请求格式验证等

    return NextResponse.next();
  } catch (error) {
    // 统一错误处理
    return handleAPIError(error, "API request failed");
  }
}
