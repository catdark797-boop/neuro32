import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://catdark797-boop.github.io/neuro32/", lastModified: new Date("2026-03-26"), changeFrequency: "weekly", priority: 1 },
    { url: "https://catdark797-boop.github.io/neuro32/about", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://catdark797-boop.github.io/neuro32/programs", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.8 },
    { url: "https://catdark797-boop.github.io/neuro32/kids", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://catdark797-boop.github.io/neuro32/teens", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://catdark797-boop.github.io/neuro32/adults", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://catdark797-boop.github.io/neuro32/cybersecurity", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://catdark797-boop.github.io/neuro32/contacts", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://catdark797-boop.github.io/neuro32/expert", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://catdark797-boop.github.io/neuro32/reviews", lastModified: new Date("2026-03-26"), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://catdark797-boop.github.io/neuro32/dashboard", lastModified: new Date("2026-03-26"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
