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
  title: "AtarWebb - Digital Solutions",
  description: "Creating innovative technology solutions for businesses. We build custom software, web applications, and digital tools to help your business thrive in the digital age.",
  keywords: "technology solutions, software development, web applications, digital transformation, business technology, custom software, innovation",
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
    title: 'AtarWebb - Digital Solutions',
    description: 'Creating innovative technology solutions for businesses. We build custom software, web applications, and digital tools to help your business thrive.',
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
    title: 'AtarWebb - Digital Solutions',
    description: 'Creating innovative technology solutions for businesses. We build custom software, web applications, and digital tools.',
    images: ['/atarwebb-favicon-white.png'],
    creator: '@atarwebb',
    site: '@atarwebb',
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
      { url: '/atarwebb-favicon-white.png', sizes: '32x32', type: 'image/png' },
      { url: '/atarwebb-favicon-white.png', sizes: '192x192', type: 'image/png' },
      { url: '/atarwebb-favicon-white.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/atarwebb-favicon-white.png', sizes: '192x192', type: 'image/png' },
      { url: '/atarwebb-favicon-white.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/atarwebb-favicon-white.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/atarwebb-favicon-white.png',
        sizes: '192x192',
      },
    ],
  },
  manifest: '/atarwebb-manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyClassName = `${interTight.variable} ${jetbrainsMono.variable} antialiased`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile-friendly Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AtarWebb" />
        <meta name="application-name" content="AtarWebb" />
        <meta name="msapplication-TileColor" content="#4A8DB8" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#4A8DB8" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Social Media Links */}
        <meta property="fb:app_id" content="your-facebook-app-id" />
        <meta property="linkedin:owner" content="your-linkedin-company-id" />
        
        {/* Direct favicon link to override any defaults */}
        <link rel="icon" href="/atarwebb-favicon-white.png" sizes="32x32" />
        <link rel="icon" href="/atarwebb-favicon-white.png" sizes="192x192" />
        <link rel="icon" href="/atarwebb-favicon-white.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/atarwebb-favicon-white.png" />
      </head>
      <BodyWrapper className={bodyClassName}>
        {children}
      </BodyWrapper>
    </html>
  );
}
