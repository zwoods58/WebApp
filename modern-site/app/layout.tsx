import type { Metadata, Viewport } from 'next'
import '../src/index.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://atarwebb.com'),
  title: {
    default: 'AtarWebb - Affordable Quality Websites | Professional Web Development',
    template: '%s | AtarWebb'
  },
  description: 'AtarWebb delivers professional, affordable websites for businesses across Africa and America. Custom web design, responsive development, and ongoing support. Turn your vision into reality with our expert team.',
  keywords: [
    // General Web Design Keywords
    'affordable website design', 'professional website designers', 'best web design services', 'website design company near me', 'web developers near me', 'business website design', 'ecommerce website developers', 'cheap web design services', 'custom website design', 'online store website design', 'small business website design', 'startup website design', 'corporate website designers', 'website redesign services', 'responsive website design', 'wordpress website design', 'website maintenance services', 'landing page design services', 'SEO-friendly website design', 'website development agency',
    // South Africa Location Keywords
    'website design south africa', 'web developers south africa', 'website design durban', 'website design johannesburg', 'website design cape town', 'website design pretoria', 'best website designers durban', 'ecommerce website south africa', 'online store developers sa', 'affordable web design south africa', 'cheap web design south africa', 'wordpress developers south africa', 'durban web development', 'johannesburg web design company', 'cape town web developers', 'pretoria website designers', 'sa small business websites', 'local website designers sa', 'website design for startups south africa', 'crm website developers south africa', 'digital agency durban', 'seo-friendly websites south africa', 'website design packages south africa', 'south africa web design agency', 'website hosting south africa', 'custom websites south africa', 'professional websites south africa', 'fast website design south africa', 'website maintenance south africa', 'mobile apps and website design south africa', 'online booking website south africa', 'real estate website developers south africa', 'restaurant website design south africa', 'personal website design south africa', 'portfolio website design south africa', 'sa business websites', 'affordable ecommerce websites south africa', 'wordpress experts sa', 'shopify website developers south africa', 'wix website designers south africa',
    // Kenya Location Keywords
    'website design kenya', 'web developers kenya', 'affordable website design kenya', 'website design nairobi', 'nairobi web developers', 'website design mombasa', 'kenya ecommerce website', 'best website designers kenya', 'cheap web design kenya', 'website developers nairobi', 'wordpress website design kenya', 'kenyan business websites', 'website design packages kenya', 'local website designers kenya', 'online store developers kenya', 'kenya website maintenance', 'real estate website developers kenya', 'hotel website design kenya', 'school website design kenya', 'church website design kenya', 'online booking website kenya', 'marketing website design kenya', 'portfolio website kenya', 'corporate website design kenya', 'kenya startup websites', 'fast website design kenya', 'ecommerce website nairobi', 'shopify developers kenya', 'wix website design kenya', 'mobile-friendly websites kenya', 'seo web design kenya', 'kenya business website solutions', 'custom website design nairobi', 'professional web developers kenya', 'wordpress maintenance kenya', 'website redesign kenya', 'kenya website support', 'kenya digital agency', 'best web design nairobi', 'custom websites kenya',
    // Rwanda Location Keywords
    'website design rwanda', 'web developers rwanda', 'affordable website design rwanda', 'website design kigali', 'kigali web developers', 'cheap website design rwanda', 'rwanda website maintenance', 'ecommerce website rwanda', 'rwanda business websites', 'wordpress website design rwanda', 'online store developers rwanda', 'school website design rwanda', 'hospital website design rwanda', 'real estate website rwanda', 'professional website designers rwanda', 'custom website design rwanda', 'rwanda website design packages', 'kigali website design company', 'local web developers kigali', 'startup website design rwanda', 'nonprofit website design rwanda', 'portfolio website design rwanda', 'church website design rwanda', 'hotel website design rwanda', 'restaurant website design rwanda', 'affordable ecommerce rwanda', 'shopify developers rwanda', 'wordpress maintenance rwanda', 'rwanda web design agency', 'top website designers kigali', 'seo web design rwanda', 'business website solutions kigali', 'fast website design kigali', 'responsive website rwanda', 'web hosting rwanda', 'personal website rwanda', 'corporate website rwanda', 'landing page design kigali', 'best web developers rwanda', 'ecommerce solutions kigali',
    // Additional General Keywords
    'web development Africa', 'web development Kenya', 'affordable websites', 'professional web design', 'business websites', 'custom websites', 'responsive design'
  ],
  authors: [{ name: 'AtarWebb' }],
  creator: 'AtarWebb',
  publisher: 'AtarWebb',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://atarwebb.com',
    siteName: 'AtarWebb',
    title: 'AtarWebb - Affordable Quality Websites',
    description: 'Professional, affordable websites for businesses. Custom web design and development with ongoing support.',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'AtarWebb - Professional Web Development',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtarWebb - Affordable Quality Websites',
    description: 'Professional, affordable websites for businesses. Custom web design and development with ongoing support.',
    images: ['/Logo.png'],
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
  icons: {
    icon: [
      { url: '/favicom.png' },
    ],
    shortcut: '/favicom.png',
    apple: '/favicom.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AtarWebb',
    description: 'Professional, affordable websites for businesses across Africa and America',
    url: 'https://atarwebb.com',
    logo: 'https://atarwebb.com/Logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-758-557-779',
      contactType: 'customer service',
      areaServed: ['KE', 'US', 'Africa'],
      availableLanguage: 'English'
    },
    sameAs: [
      'https://atarwebb.com'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50'
    }
  }

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17764042442"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17764042442');
            `,
          }}
        />
        {/* Google Tag Manager - Replace GTM-XXXXXXX with your actual GTM ID */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
