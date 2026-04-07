import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/SchemaOrg";
import SessionProvider from "@/components/providers/SessionProvider";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { GlitchEffect } from "@/components/effects/GlitchEffect";

export const metadata: Metadata = {
  metadataBase: new URL("https://catdark797-boop.github.io/neuro32"),
  title: {
    default: "Нейро 32 — Лаборатория ИИ-технологий | Новозыбков",
    template: "%s | Нейро 32",
  },
  description:
    "Офлайн-практики искусственного интеллекта в Новозыбкове. Для детей с 7 лет, подростков и взрослых. Нейросети, языковые модели, кибербезопасность. Первая встреча бесплатно.",
  keywords: [
    "нейросети", "искусственный интеллект", "ИИ", "Новозыбков",
    "ChatGPT", "GigaChat", "YandexGPT", "кибербезопасность",
    "для детей", "для подростков", "для взрослых", "Python",
  ],
  authors: [{ name: "Денис Степан Марьянович" }],
  creator: "Денис Степан Марьянович",
  publisher: "Нейро 32",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Нейро 32",
    title: "Нейро 32 — Живые практики ИИ в Новозыбкове",
    description: "Офлайн-сессии по ИИ. Дети с 7 лет, подростки, взрослые. Первая встреча бесплатно.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Нейро 32 — Живые практики ИИ в Новозыбкове",
    description: "Офлайн-сессии по ИИ. Дети с 7 лет, подростки, взрослые. Первая встреча бесплатно.",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Нейро 32",
              telephone: "+79019769810",
              address: {
                "@type": "PostalAddress",
                streetAddress: "ул. Коммунистическая, 22А",
                addressLocality: "Новозыбков",
                addressRegion: "Брянская область",
                addressCountry: "RU",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" style={{ fontFamily: "var(--font-b)" }}>
        <SessionProvider>
          <OrganizationSchema />
          <LocalBusinessSchema />
          <Header />
          <main className="flex-1" style={{ paddingTop: "var(--nav-h)" }}>
            {children}
          </main>
          <Footer />
          <AIChatWidget />
          <ScrollReveal />
          <CustomCursor />
          <ScrollProgress />
          <GlitchEffect />
          <LoadingScreen />
        </SessionProvider>
      </body>
    </html>
  );
}
