import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/noto-sans-devanagari";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const seasons = localFont({
  src: [
    { path: "./fonts/Fontspring-DEMO-theseasons-lt.otf", weight: "300", style: "normal" },
    { path: "./fonts/Fontspring-DEMO-theseasons-ltit.otf", weight: "300", style: "italic" },
    { path: "./fonts/Fontspring-DEMO-theseasons-reg.otf", weight: "400", style: "normal" },
    { path: "./fonts/Fontspring-DEMO-theseasons-it.otf", weight: "400", style: "italic" },
    { path: "./fonts/Fontspring-DEMO-theseasons-bd.otf", weight: "700", style: "normal" },
    { path: "./fonts/Fontspring-DEMO-theseasons-bdit.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-seasons",
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
  themeColor: "#171713",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={seasons.variable}>
      <body>{children}</body>
    </html>
  );
}
