import { NextRequest, NextResponse } from "next/server";

export class APIError extends Error {
  public status: number;
  public details?: string;

  constructor(message: string, status: number = 500, details?: string) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}

/**
 * API错误处理中间件
 */
export function handleAPIError(
  error: unknown,
  defaultMessage: string = "Internal Server Error",
): NextResponse {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        details: error.details,
      },
      { status: error.status },
    );
  }

  let errorMessage = defaultMessage;
  let status = 500;

  if (error instanceof Error) {
    errorMessage = error.message;

    // 处理常见的数据库错误
    if (error.message.includes("Unique constraint")) {
      status = 409; // Conflict
      errorMessage = "Resource already exists";
    } else if (error.message.includes("Foreign key constraint")) {
      status = 400; // Bad Request
      errorMessage = "Invalid reference to related resource";
    } else if (error.message.includes("Record to update not found")) {
      status = 404; // Not Found
      errorMessage = "Resource not found";
    }
  }

  return NextResponse.json(
    {
      error: defaultMessage,
      details: errorMessage,
    },
    { status },
  );
}

/**
 * 验证ID参数
 */
export function validateId(
  id: string,
  resourceName: string = "Resource",
): number {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    throw new APIError(`Invalid ${resourceName.toLowerCase()} ID`, 400);
  }
  return numericId;
}

/**
 * 验证必填字段
 */
export function validateRequired(
  data: Record<string, any>,
  fields: string[],
): void {
  const missing = fields.filter((field) => !data[field]);
  if (missing.length > 0) {
    throw new APIError(`Missing required fields: ${missing.join(", ")}`, 400);
  }
}
