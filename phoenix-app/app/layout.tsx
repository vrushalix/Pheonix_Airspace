import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phoenix Services — Flight Path Intelligence",
  description:
    "Weather-aware flight path optimization for aviation professionals. Real-time weather layers, wind patterns, and AI-powered route efficiency.",
  keywords: [
    "aviation",
    "flight path optimization",
    "weather aviation",
    "ATC tools",
    "pilot software",
  ],
  authors: [{ name: "Phoenix Services" }],
  robots: "index, follow",
  openGraph: {
    title: "Phoenix Services — Flight Path Intelligence",
    description: "AI-powered flight routing for aviation professionals.",
    type: "website",
    url: "https://phoenix-airspace.web.app",
  },
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {/* GA4 — loaded but no data sent until consent granted */}
        {GA4_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // Default: deny all until consent banner is accepted (GDPR)
                gtag('consent', 'default', {
                  'analytics_storage': 'denied',
                  'ad_storage': 'denied',
                  'wait_for_update': 500
                });
                gtag('config', '${GA4_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <AuthProvider>
          {children}
          <CookieConsentBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
