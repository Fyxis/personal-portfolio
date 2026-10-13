import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Archivo } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#06090E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.ideloop.web.id"),
  title: {
    default: "Adrianus Bagus Setiaji (Fyxis) | Technical PM & Full Stack Engineer",
    template: "%s | Adrianus Bagus Setiaji (Fyxis)",
  },
  description:
    "Co-Founder & Technical PM / Full Stack Engineer at Newsaint Digital Solution. Crafting high-performance Next.js web applications, scalable backend systems, and modern digital platforms.",
  applicationName: "Fyxis Portfolio",
  authors: [{ name: "Adrianus Bagus Setiaji", url: "https://github.com/Fyxis" }],
  creator: "Adrianus Bagus Setiaji",
  publisher: "Newsaint Digital Solution",
  keywords: [
    "Adrianus Bagus Setiaji",
    "Adrianus Bagus",
    "Fyxis",
    "Technical Project Manager",
    "Full Stack Engineer",
    "Senior Full Stack Developer",
    "Next.js Developer Indonesia",
    "React Developer",
    "TypeScript Engineer",
    "Newsaint Digital Solution",
    "Software Engineer Portfolio",
    "Cloud Solutions",
    "Web Architecture",
  ],
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
    type: "website",
    locale: "en_US",
    url: "https://portfolio.ideloop.web.id",
    title: "Adrianus Bagus Setiaji (Fyxis) | Technical PM & Full Stack Engineer",
    description:
      "Co-Founder & Technical PM / Full Stack Engineer at Newsaint Digital Solution. Crafting high-performance Next.js web applications, scalable backend systems, and modern digital platforms.",
    siteName: "Adrianus Bagus Setiaji Portfolio",
    images: [
      {
        url: "/images/banner-bg-2.jpg",
        width: 1200,
        height: 630,
        alt: "Adrianus Bagus Setiaji (Fyxis) — Technical PM & Full Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrianus Bagus Setiaji (Fyxis) | Technical PM & Full Stack Engineer",
    description:
      "Co-Founder & Technical PM / Full Stack Engineer at Newsaint Digital Solution. Crafting high-performance Next.js web applications, scalable backend systems, and modern digital platforms.",
    creator: "@Fyxis",
    images: ["/images/banner-bg-2.jpg"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/manifest.json",
  verification: {
    google: "14A9pBT7orBDLuBZskoN-nTidFZpYOkhrWi_1ghFYew",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://portfolio.ideloop.web.id/#person",
      name: "Adrianus Bagus Setiaji",
      alternateName: ["Fyxis", "Adrianus Bagus"],
      jobTitle: "Technical Project Manager & Full Stack Engineer",
      worksFor: {
        "@type": "Organization",
        name: "Newsaint Digital Solution",
        url: "https://newsaint.web.id",
      },
      url: "https://portfolio.ideloop.web.id",
      image: "https://portfolio.ideloop.web.id/images/header-img-2.jpg",
      email: "bagusadrianus@gmail.com",
      sameAs: [
        "https://github.com/Fyxis",
        "https://www.linkedin.com/in/adrianus-bagus-737418259/",
        "https://www.instagram.com/bagus.jpeg",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://portfolio.ideloop.web.id/#website",
      url: "https://portfolio.ideloop.web.id",
      name: "Adrianus Bagus Setiaji (Fyxis) | Technical PM & Full Stack Engineer",
      description:
        "Official portfolio of Adrianus Bagus Setiaji (@Fyxis). Co-Founder & Technical PM / Full Stack Engineer at Newsaint Digital Solution.",
      publisher: {
        "@id": "https://portfolio.ideloop.web.id/#person",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${archivo.variable} dark scroll-smooth`}>
      <head>
        <meta
          name="google-site-verification"
          content="14A9pBT7orBDLuBZskoN-nTidFZpYOkhrWi_1ghFYew"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#0A0B10] text-[#F8FAFC] antialiased selection:bg-[#2A41FF]/30 selection:text-white min-h-screen relative font-sans">
        {children}
      </body>
    </html>
  );
}
