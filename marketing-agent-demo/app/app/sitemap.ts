import type { MetadataRoute } from "next";
import { AppConfig } from "@/lib/config";

const BASE = AppConfig.app.url;

export default function sitemap(): MetadataRoute.Sitemap {
  if (AppConfig.app.isDev) return [];

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/slides`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
