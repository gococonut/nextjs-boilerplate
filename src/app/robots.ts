import type { MetadataRoute } from "next";
import { siteConfig } from "../utils/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"], // 禁止爬取API和管理页面
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
