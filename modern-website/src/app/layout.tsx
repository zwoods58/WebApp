import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google"; // New fonts
import "./globals.css";
import BodyWrapper from "./components/BodyWrapper";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"], // Regular, Medium
});

export const metadata: Metadata = {
  title: "AtarWebb | The Invisible Architect",
  description: "We build the silent infrastructures that power the world's most complex ambitions. Enterprise-grade software development, cloud architecture, and digital transformation solutions.",
  keywords: "software development, cloud architecture, enterprise solutions, digital transformation, web development, mobile apps, infrastructure, technology consulting",
  authors: [{ name: "AtarWebb" }],
  creator: "AtarWebb",
  publisher: "AtarWebb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://atarwebb.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AtarWebb | The Invisible Architect',
    description: 'We build the silent infrastructures that power the world\'s most complex ambitions. Enterprise-grade software development and cloud architecture solutions.',
    siteName: 'AtarWebb',
    images: [
      {
        url: '/atarwebb-favicon-white.png',
        width: 512,
        height: 512,
        alt: 'AtarWebb Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtarWebb | The Invisible Architect',
    description: 'We build the silent infrastructures that power the world\'s most complex ambitions.',
    images: ['/atarwebb-favicon-white.png'],
    creator: '@atarwebb',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/atarwebb-favicon-white.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/atarwebb-favicon-white.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icon-192x192.png',
        sizes: '192x192',
      },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${interTight.variable} ${jetbrainsMono.variable} antialiased`;

  return (
    <html lang="en" suppressHydrationWarning>
      <BodyWrapper className={bodyClassName}>
        {children}
      </BodyWrapper>
    </html>
  );
}
