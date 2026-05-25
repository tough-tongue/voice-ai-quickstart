import type { MetadataRoute } from "next";
import { AppConfig } from "@/lib/config";

const BASE_URL = AppConfig.app.url;

export default function sitemap(): MetadataRoute.Sitemap {
  if (AppConfig.app.isDev) {
    return [];
  }

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${BASE_URL}/test`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/coach`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/results`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
