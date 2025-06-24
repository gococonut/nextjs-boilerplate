"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { session, isAuthenticated } = useAuth();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 示例 API 调用函数
  const callExampleAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/example");
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("API 调用失败:", error);
      setApiResponse({ error: "API 调用失败" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* 欢迎部分 */}
      <div className="mb-12 text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{t("title")}</h1>
        <p className="text-base-content/70 mx-auto mb-8 max-w-2xl text-lg">
          这是一个 Next.js 开发模板，包含国际化、认证、主题切换等基础功能。
        </p>

        {/* 登录状态提示 */}
        <div className="mx-auto max-w-md">
          {isAuthenticated ? (
            <div className="bg-base-200/50 border-base-content/10 rounded-lg border p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-success">●</span>
                <span className="font-medium">
                  欢迎回来，{session?.user?.name || "用户"}！
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-base-200/50 border-base-content/10 rounded-lg border p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-base-content/50">●</span>
                <span>您当前未登录，可以点击右上角登录按钮进行登录。</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 功能演示卡片 */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 国际化演示 */}
        <div className="bg-base-100 border-base-content/10 hover:border-base-content/20 group rounded-lg border p-6 transition-all duration-200">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <h3 className="text-lg font-semibold">国际化</h3>
          </div>
          <p className="text-base-content/70 mb-4">
            支持多语言切换，当前显示：{t("title")}
          </p>
          <div className="flex justify-end">
            <span className="bg-base-200 text-base-content/60 rounded-md px-2 py-1 text-xs">
              next-intl
            </span>
          </div>
        </div>

        {/* 认证演示 */}
        <div className="bg-base-100 border-base-content/10 hover:border-base-content/20 group rounded-lg border p-6 transition-all duration-200">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <h3 className="text-lg font-semibold">用户认证</h3>
          </div>
          <p className="text-base-content/70 mb-4">
            {isAuthenticated
              ? `已登录用户：${session?.user?.name || "用户"}`
              : "支持 GitHub 和 Google 登录"}
          </p>
          <div className="flex justify-end">
            <span className="bg-base-200 text-base-content/60 rounded-md px-2 py-1 text-xs">
              better-auth
            </span>
          </div>
        </div>

        {/* 主题切换演示 */}
        <div className="bg-base-100 border-base-content/10 hover:border-base-content/20 group rounded-lg border p-6 transition-all duration-200">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🎨</span>
            <h3 className="text-lg font-semibold">主题切换</h3>
          </div>
          <p className="text-base-content/70 mb-4">
            支持明亮、暗黑、跟随系统主题
          </p>
          <div className="flex justify-end">
            <span className="bg-base-200 text-base-content/60 rounded-md px-2 py-1 text-xs">
              daisyUI
            </span>
          </div>
        </div>
      </div>

      {/* API 调用演示 */}
      <div className="mb-12">
        <div className="bg-base-100 border-base-content/10 rounded-lg border p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">🚀</span>
            <h3 className="text-lg font-semibold">API 调用演示</h3>
          </div>
          <p className="text-base-content/70 mb-6">点击按钮调用示例 API 接口</p>

          <button
            className={`btn ${loading ? "loading" : ""} bg-primary text-primary-content hover:bg-primary/90`}
            onClick={callExampleAPI}
            disabled={loading}
          >
            {loading ? "调用中..." : "调用示例 API"}
          </button>

          {apiResponse && (
            <div className="mt-6">
              <div className="text-base-content/70 mb-3 text-sm font-medium">
                API 响应
              </div>
              <div className="bg-base-200 rounded-lg p-4">
                <pre className="text-sm">
                  <code>{JSON.stringify(apiResponse, null, 2)}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 技术栈信息 */}
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="text-2xl">🛠️</span>
          <h3 className="text-2xl font-bold">技术栈</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            Next.js 15
          </span>
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            TypeScript
          </span>
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            Tailwind CSS
          </span>
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            daisyUI
          </span>
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            Prisma
          </span>
          <span className="bg-base-200 text-base-content border-base-content/10 rounded-lg border px-3 py-2 text-sm font-medium">
            PostgreSQL
          </span>
        </div>
      </div>
    </div>
  );
}
