import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource/gotu/400.css";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const bakers = localFont({
  src: "./fonts/TT-Bakers-VF-Trial.ttf",
  variable: "--font-bakers",
  weight: "100 900",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Prachi & Pratik | 24 October 2026",
  description: "You are invited to celebrate Prachi and Pratik on 24 October 2026.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Prachi & Pratik",
    description: "After six years, we are making it official. Come celebrate with us.",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 676, alt: "Prachi and Pratik together" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prachi & Pratik",
    description: "24 October 2026",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#171713",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={bakers.variable}>
      <body>{children}</body>
    </html>
  );
}
