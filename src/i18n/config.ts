/**
 * 国际化配置
 */

// 默认语言 - 这是内容的主要创建语言
export const DEFAULT_LOCALE = "en";

// 支持的语言列表
export const SUPPORTED_LOCALES = ["zh", "zh-TW", "en", "ja", "ko"] as const;

// 支持的语言类型
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * 检查给定的语言代码是否被支持
 *
 * @param locale 要检查的语言代码
 * @returns 是否支持该语言
 */
export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * 从 Pages Router 请求中获取语言代码
 * 适用于 Next.js Pages API 路由处理程序
 *
 * @param req API 请求对象
 * @returns 当前请求的语言代码
 */
export function getLocaleFromRequest(req: any): string {
  // 1. 首先尝试从查询参数获取
  const localeFromQuery = req.query?.locale;
  if (localeFromQuery && isValidLocale(localeFromQuery)) {
    return localeFromQuery;
  }

  // 2. 然后从 cookie 中获取 NEXT_LOCALE
  const cookieHeader = req.headers?.cookie;
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").reduce(
      (acc: Record<string, string>, cookie: string) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const localeFromCookie = cookies["NEXT_LOCALE"];
    if (localeFromCookie && isValidLocale(localeFromCookie)) {
      return localeFromCookie;
    }
  }

  // 3. 然后尝试从 Accept-Language 头获取
  const acceptLanguage = req.headers?.["accept-language"];
  if (acceptLanguage) {
    // 简单处理 Accept-Language 头
    // 实际生产环境可能需要更复杂的解析逻辑
    const preferredLanguage = acceptLanguage
      .split(",")[0]
      .trim()
      .split(";")[0]
      .trim();

    // 寻找匹配的语言代码
    for (const locale of SUPPORTED_LOCALES) {
      if (
        preferredLanguage.startsWith(locale) ||
        preferredLanguage.startsWith(locale.split("-")[0])
      ) {
        return locale;
      }
    }
  }

  // 4. 如果都没找到，返回默认语言
  return DEFAULT_LOCALE;
}

/**
 * 从 App Router 请求中获取语言代码
 * 适用于 Next.js App API 路由处理程序
 *
 * @param request 请求对象
 * @returns 当前请求的语言代码
 */
export function getLocaleFromAppRequest(request: Request): string {
  try {
    // 1. 从 URL 查询参数中获取
    const url = new URL(request.url);
    const localeFromQuery = url.searchParams.get("locale");
    if (localeFromQuery && isValidLocale(localeFromQuery)) {
      return localeFromQuery;
    }

    // 2. 从 cookies 中获取 NEXT_LOCALE
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          if (key && value) acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const localeFromCookie = cookies["NEXT_LOCALE"];
      if (localeFromCookie && isValidLocale(localeFromCookie)) {
        return localeFromCookie;
      }
    }

    // 3. 从 Accept-Language 头获取
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
      const preferredLanguages = acceptLanguage.split(",");
      const firstPreference = preferredLanguages[0]
        ?.trim()
        .split(";")[0]
        ?.trim();

      if (firstPreference) {
        // 寻找匹配的语言代码
        for (const locale of SUPPORTED_LOCALES) {
          const localePrefix = locale.split("-")[0];
          if (
            firstPreference.startsWith(locale) ||
            (localePrefix && firstPreference.startsWith(localePrefix))
          ) {
            return locale;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error parsing locale from request:", error);
  }

  // 4. 返回默认语言
  return DEFAULT_LOCALE;
}
