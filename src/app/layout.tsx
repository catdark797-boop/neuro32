import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema, LocalBusinessSchema } from "@/components/seo/SchemaOrg";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://neuro32.ru"),
  title: {
    default: "НЕЙРО32 — Лаборатория ИИ-технологий | Новозыбков",
    template: "%s | НЕЙРО32",
  },
  description:
    "Практические встречи по освоению навыков работы с нейросетями для детей, подростков и взрослых. Офлайн в Новозыбкове.",
  keywords: [
    "нейросети",
    "искусственный интеллект",
    "ИИ",
    "промптинг",
    "Новозыбков",
    "ЧатGPT",
    "Claude",
    "для детей",
    "для подростков",
    "для взрослых",
  ],
  authors: [{ name: "Денис Степан Марьянович" }],
  creator: "Денис Степан Марьянович",
  publisher: "НЕЙРО32",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://neuro32.ru",
    siteName: "НЕЙРО32",
    title: "НЕЙРО32 — Лаборатория ИИ-технологий",
    description:
      "Практические встречи по освоению навыков работы с нейросетями в Новозыбкове",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "НЕЙРО32 — Лаборатория ИИ-технологий",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "НЕЙРО32 — Лаборатория ИИ-технологий",
    description:
      "Практические встречи по освоению навыков работы с нейросетями в Новозыбкове",
    images: ["/og-image.svg"],
  },
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
  alternates: {
    canonical: "https://neuro32.ru",
  },
  category: "technology",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <OrganizationSchema />
        <LocalBusinessSchema />
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
