import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientRoot from "@/components/layout/ClientRoot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AdPilot AI — Generate Google Ads That Convert",
  description: "AI-powered Google Ads assistant. Generate high-CTR RSA ads, avoid moderation bans, and boost conversions with GPT-5 and Claude.",
  keywords: "Google Ads, AI ads generator, RSA ads, CTR optimization, ad copy AI",
  openGraph: {
    title: "AdPilot AI — Premium AI Google Ads Platform",
    description: "Generate high-converting Google Ads with AI. Powered by GPT-5 + Claude.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" style={{ background: '#050508', color: '#f8fafc' }}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
