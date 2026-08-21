import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-serif-devanagari";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
