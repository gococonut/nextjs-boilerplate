import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 模拟一些处理时间
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = {
    message: "Hello from API!",
    timestamp: new Date().toISOString(),
    method: "GET",
    status: "success",
    data: {
      features: [
        "Next.js 15",
        "TypeScript",
        "Tailwind CSS",
        "daisyUI",
        "国际化",
        "用户认证",
      ],
      version: "1.0.0",
    },
  };

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const data = {
    message: "Data received successfully!",
    timestamp: new Date().toISOString(),
    method: "POST",
    receivedData: body,
    status: "success",
  };

  return NextResponse.json(data);
}
