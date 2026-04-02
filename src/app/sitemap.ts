import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = "https://catdark797-boop.github.io/neuro32";
const now = new Date("2026-03-30");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kids`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/teens`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/adults`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/cyber`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/packages`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/safety`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contacts`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/auth`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
