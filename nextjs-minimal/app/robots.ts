import type { MetadataRoute } from "next";
import { AppConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  if (AppConfig.app.isDev) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${AppConfig.app.url}/sitemap.xml`,
  };
}
