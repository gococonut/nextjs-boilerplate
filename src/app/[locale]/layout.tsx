import "../../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../../components/Navbar";
import { AuthProvider } from "../../context/AuthContext";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"] });

// 生成动态metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // 验证语言代码
  if (!hasLocale(routing.locales, locale)) {
    return {
      title: "开发模板",
      description: "Next.js 开发模板",
    };
  }

  // 加载语言文件
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    return {
      title: "开发模板",
      description: "Next.js 开发模板",
    };
  }

  return {
    title: messages.siteName || "开发模板",
    description:
      "基于 Next.js 的现代化开发模板，包含国际化、认证、主题切换等基础功能",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 验证语言代码
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 加载语言文件
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        {/* 基础meta标签 */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} bg-base-100 min-h-screen`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="container mx-auto flex-grow px-4 py-4 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
