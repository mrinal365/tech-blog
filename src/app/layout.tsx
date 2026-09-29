import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { ColorPaletteTester } from "@/components/layout/ColorPaletteTester";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sde.guide"),
  title: {
    default: "SDE.GUIDE — Full-Stack Engineering & System Architecture Platform",
    template: "%s | SDE.GUIDE",
  },
  description:
    "SDE.GUIDE is a developer-first technical blog and architecture publishing platform. Read and write structured engineering deep-dives across System Design, Distributed Systems, Next.js, Node.js, PostgreSQL, MongoDB, microservices, and modern web application architecture.",
  keywords: [
    "SDE.GUIDE",
    "System Design",
    "Full-Stack Engineering",
    "Software Architecture",
    "Software Engineer Blog",
    "Distributed Systems",
    "Microservices",
    "React 19",
    "Next.js App Router",
    "Node.js & Express",
    "PostgreSQL",
    "MongoDB",
    "Redis Caching",
    "API Design",
    "High Performance Web Apps",
  ],
  authors: [{ name: "Mrinal", url: "https://sde.guide/user/mrinal" }],
  creator: "Mrinal",
  publisher: "SDE.GUIDE",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
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
  openGraph: {
    title: "SDE.GUIDE — Full-Stack Engineering & System Architecture Platform",
    description:
      "Curated Technical Guides, System Design Deep-Dives, and Modern Code Patterns for Software Engineers.",
    url: "https://sde.guide",
    siteName: "SDE.GUIDE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "SDE.GUIDE Logo — Full-Stack Engineering Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SDE.GUIDE — Full-Stack Engineering & System Architecture",
    description:
      "Curated Technical Guides, System Design Deep-Dives, and Modern Code Patterns for Engineers.",
    images: ["/logo.png"],
    creator: "@sde_guide",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data Schema.org (JSON-LD)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SDE.GUIDE",
    "url": "https://sde.guide",
    "description":
      "Full-Stack Engineering & System Architecture Platform for Software Development Engineers",
    "publisher": {
      "@type": "Organization",
      "name": "SDE.GUIDE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sde.guide/logo.png",
      },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://sde.guide/articles?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SDE.GUIDE",
    "url": "https://sde.guide",
    "logo": "https://sde.guide/logo.png",
    "sameAs": ["https://github.com"],
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#121212] font-sans text-[#e8e8e8] antialiased">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ColorPaletteTester />
        </StoreProvider>
      </body>
    </html>
  );
}
