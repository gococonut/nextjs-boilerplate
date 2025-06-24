import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// 验证用户是否已登录
export async function validateAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  session: any | null;
}> {
  try {
    // 从请求中获取会话
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // 用户已登录，返回会话信息
    return {
      isAuthenticated: !!session?.user,
      session,
    };
  } catch (error) {
    console.error("验证会话时出错:", error);
    return {
      isAuthenticated: false,
      session: null,
    };
  }
}

// 需要登录的中间件 - 如果用户未登录，返回403错误
export async function requireAuth(request: NextRequest) {
  const { isAuthenticated } = await validateAuth(request);

  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "未授权访问", message: "需要登录才能访问此资源" },
      { status: 403 },
    );
  }

  // 用户已登录，继续处理请求
  return null;
}

// 获取认证信息的中间件 - 不强制要求登录，但提供会话信息
export async function getAuthInfo(request: NextRequest) {
  return await validateAuth(request);
}

// 仅允许特定HTTP方法的中间件 (GET, POST, PUT, DELETE)
export function allowMethods(request: NextRequest, allowedMethods: string[]) {
  const method = request.method.toUpperCase();

  if (!allowedMethods.includes(method)) {
    return NextResponse.json(
      { error: "方法不允许", message: `此路由不支持 ${method} 方法` },
      { status: 405 },
    );
  }

  return null;
}

// 为未登录用户限制非GET请求的中间件
export async function restrictNonGetForGuests(request: NextRequest) {
  const method = request.method.toUpperCase();

  // 如果是GET请求，允许继续
  if (method === "GET") {
    return null;
  }

  // 对于非GET请求，检查是否已登录
  const { isAuthenticated } = await validateAuth(request);
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: "未授权访问", message: "需要登录才能执行此操作" },
      { status: 403 },
    );
  }

  // 用户已登录，允许继续
  return null;
}
