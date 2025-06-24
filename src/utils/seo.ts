import type { Metadata } from "next";
import { siteConfig } from "./siteConfig";

// 支持的语言列表
const supportedLocales = ["zh", "zh-TW", "en", "ja", "ko"];

/**
 * 生成基础metadata - 简化版本
 */
export function generateMetadata({
  title,
  description,
  url,
  locale,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  locale: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  // 生成多语言链接
  const alternateLanguages: Record<string, string> = {};
  supportedLocales.forEach((loc) => {
    if (loc !== locale) {
      alternateLanguages[loc] = url.replace(`/${locale}`, `/${loc}`);
    }
  });

  // 默认图片
  const defaultImage = `${siteConfig.url}/light-logo.png`;
  const ogImage = image || defaultImage;

  return {
    title,
    description,
    keywords: getKeywordsByLocale(locale),

    // Open Graph
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.shortName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type,
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    // 多语言链接和权威链接
    alternates: {
      canonical: url,
      languages: alternateLanguages,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * 生成文章页面metadata
 */
export function generatePostMetadata({
  post,
  locale,
  seoMessages,
}: {
  post: {
    id: number;
    title: string;
    description?: string | null;
    one_liner_summary?: string | null;
    content_summary?: string | null;
    image_url?: string | null;
    source: string;
    author_name?: string | null;
    published_at?: Date | string | null;
    tags?: string[];
  };
  locale: string;
  seoMessages: {
    postTitle: string;
    postDescription: string;
    keywords: string;
  };
}): Metadata {
  // 文章标题 + 品牌名
  const title = seoMessages.postTitle.replace("{title}", post.title);

  // 使用AI生成摘要作为描述
  const description =
    post.description ||
    post.one_liner_summary ||
    post.content_summary ||
    seoMessages.postDescription
      .replace("{title}", post.title)
      .replace("{source}", post.source);

  const url = `${siteConfig.url}/${locale}/post/${post.id}`;

  // 生成关键词，包含文章标签
  const keywords = [
    seoMessages.keywords,
    getKeywordsByLocale(locale),
    post.tags?.join(",") || "",
    post.source,
  ]
    .filter(Boolean)
    .join(",");

  const metadata = generateMetadata({
    title,
    description,
    url,
    locale,
    image: post.image_url || undefined,
    type: "article",
  });

  // 为文章页面添加特定的keywords
  metadata.keywords = keywords;

  // 添加发布时间信息到Open Graph (注意：Next.js的OpenGraph类型可能不包含publishedTime)
  if (
    post.published_at &&
    metadata.openGraph &&
    "publishedTime" in metadata.openGraph
  ) {
    (metadata.openGraph as any).publishedTime = new Date(
      post.published_at,
    ).toISOString();
  }

  return metadata;
}

/**
 * 生成首页metadata
 */
export function generateHomeMetadata({
  locale,
  seoMessages,
  boards,
}: {
  locale: string;
  seoMessages: {
    siteTitle: string;
    siteDescription: string;
  };
  boards?: Array<{ title: string; source: string }>;
}): Metadata {
  const url = `${siteConfig.url}/${locale}`;

  // 如果有看板信息，在描述中包含看板来源
  let description = seoMessages.siteDescription;
  if (boards && boards.length > 0) {
    const sources = boards.map((board) => board.source).join(", ");
    description = `${seoMessages.siteDescription} 汇聚来自 ${sources} 等平台的精选内容。`;
  }

  return generateMetadata({
    title: seoMessages.siteTitle,
    description,
    url,
    locale,
    type: "website",
  });
}

/**
 * 生成文章结构化数据 (JSON-LD)
 */
export function generateArticleStructuredData({
  post,
  locale,
}: {
  post: {
    id: number;
    title: string;
    description?: string | null;
    one_liner_summary?: string | null;
    content_summary?: string | null;
    image_url?: string | null;
    source: string;
    author_name?: string | null;
    published_at?: Date | string | null;
  };
  locale: string;
}) {
  const description =
    post.description ||
    post.one_liner_summary ||
    post.content_summary ||
    `来自${post.source}的文章`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: description,
    image: post.image_url || `${siteConfig.url}/light-logo.png`,
    url: `${siteConfig.url}/${locale}/post/${post.id}`,
    datePublished: post.published_at
      ? new Date(post.published_at).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: post.author_name || post.source || siteConfig.shortName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.shortName,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/light-logo.png`,
      },
    },
  };
}

/**
 * 生成网站结构化数据 (JSON-LD)
 */
export function generateWebSiteStructuredData(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.shortName,
    description: siteConfig.description,
    url: `${siteConfig.url}/${locale}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/${locale}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * 根据语言获取关键词
 */
function getKeywordsByLocale(locale: string): string {
  const keywordMap: Record<string, string> = {
    zh: "科技新闻,编程,开源,产品,播客,深度阅读,AI阅读",
    "zh-TW": "科技新聞,程式設計,開源,產品,播客,深度閱讀,AI閱讀",
    en: "tech news,programming,open source,product,podcast,deep reading,AI reading",
    ja: "テクニュース,プログラミング,オープンソース,プロダクト,ポッドキャスト,深い読書,AI読書",
    ko: "기술 뉴스,프로그래밍,오픈소스,제품,팟캐스트,깊이 읽기,AI 읽기",
  };

  return keywordMap[locale] || keywordMap.zh || "";
}
