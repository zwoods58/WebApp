import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import ConditionalLayout from '@/components/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://atarwebb.com'),
  title: 'AtarWebb',
  description: 'Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.',
  keywords: 'web development, custom web applications, React, Next.js, full-stack development, business solutions',
  authors: [{ name: 'AtarWebb' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/Favicon.png',
    apple: '/Favicon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AtarWebb',
  },
  openGraph: {
    title: 'AtarWebb - Professional Web Development Services',
    description: 'Transform your business with custom web applications. Professional development services including React, Next.js, and full-stack solutions.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AtarWebb",
    "url": "https://atarwebb.com",
    "logo": "https://atarwebb.com/logo.png",
    "description": "Professional web development services including custom websites, web applications, and mobile apps. Fast delivery in 7 days with transparent pricing.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Business St",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94105",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "admin@atarwebb.com"
    },
    "sameAs": [
      "https://atarwebb.com"
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "The Basic Launchpad",
        "description": "Single page website for startups",
        "price": "150",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "The Standard Optimizer",
        "description": "Multi-page website for growing businesses",
        "price": "250",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "name": "The Premium Accelerator",
        "description": "Advanced website with custom features",
        "price": "500",
        "priceCurrency": "USD"
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileImage" content="/Logo.png" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/Logo.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/Logo.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/Logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/Logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/Logo.png" />
        
        {/* OpenSearch for browser search integration */}
        <link rel="search" type="application/opensearchdescription+xml" title="AtarWebb Search" href="/opensearch.xml" />
        
        {/* Auto Language Detection Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Simple auto-translate script
              (function() {
                if (typeof window === 'undefined') return;
                
                // Translation data
                const translations = {
                  'Services': {
                    'en': 'Services', 'es': 'Servicios', 'fr': 'Services', 'de': 'Dienstleistungen',
                    'it': 'Servizi', 'pt': 'Serviços', 'ru': 'Услуги', 'ja': 'サービス',
                    'ko': '서비스', 'zh': '服务', 'ar': 'الخدمات', 'hi': 'सेवाएं', 'sw': 'Huduma',
                    'am': 'አገልግሎቶች', 'ha': 'Sabis', 'yo': 'Awọn iṣẹ', 'ig': 'Ọrụ', 'zu': 'Izinsiza', 'xh': 'Iinkonzo',
                    'af': 'Dienste', 'so': 'Adeeg', 'ti': 'ኣገልግሎታት', 'om': 'Taja', 'rw': 'Serivisi', 'rn': 'Serivisi',
                    'lg': 'Ebyo ebikoleddwa', 'ny': 'Ntchito', 'sn': 'Mabasa', 'st': 'Litšebeletso', 'tn': 'Ditirelo',
                    'ts': 'Misebetsi', 've': 'Misebetsi', 'wo': 'Xaral', 'ff': 'Pillal', 'bm': 'Baara',
                    'dy': 'Baara', 'kab': 'Iɣawasen', 'shi': 'Iɣawasen', 'tzm': 'Iɣawasen', 'ber': 'Iɣawasen'
                  },
                  'Portfolio': {
                    'en': 'Portfolio', 'es': 'Portafolio', 'fr': 'Portfolio', 'de': 'Portfolio',
                    'it': 'Portfolio', 'pt': 'Portfólio', 'ru': 'Портфолио', 'ja': 'ポートフォリオ',
                    'ko': '포트폴리오', 'zh': '作品集', 'ar': 'المحفظة', 'hi': 'पोर्टफोलियो', 'sw': 'Portfolio',
                    'am': 'ፖርትፎሊዮ', 'ha': 'Portfolio', 'yo': 'Portfolio', 'ig': 'Portfolio', 'zu': 'I-Portfolio', 'xh': 'I-Portfolio',
                    'af': 'Portefeulje', 'so': 'Portfolio', 'ti': 'Portfolio', 'om': 'Portfolio', 'rw': 'Portfolio', 'rn': 'Portfolio',
                    'lg': 'Portfolio', 'ny': 'Portfolio', 'sn': 'Portfolio', 'st': 'Portfolio', 'tn': 'Portfolio',
                    'ts': 'Portfolio', 've': 'Portfolio', 'wo': 'Portfolio', 'ff': 'Portfolio', 'bm': 'Portfolio',
                    'dy': 'Portfolio', 'kab': 'Portfolio', 'shi': 'Portfolio', 'tzm': 'Portfolio', 'ber': 'Portfolio'
                  },
                  'About Us': {
                    'en': 'About Us', 'es': 'Acerca de Nosotros', 'fr': 'À Propos', 'de': 'Über Uns',
                    'it': 'Chi Siamo', 'pt': 'Sobre Nós', 'ru': 'О Нас', 'ja': '私たちについて',
                    'ko': '회사 소개', 'zh': '关于我们', 'ar': 'من نحن', 'hi': 'हमारे बारे में', 'sw': 'Kuhusu Sisi',
                    'am': 'በዛሬው', 'ha': 'Game da Mu', 'yo': 'Nipa Wa', 'ig': 'Banyere Anyị', 'zu': 'Ngathi', 'xh': 'Ngathi',
                    'af': 'Oor Ons', 'so': 'Ku Saabsan', 'ti': 'ብዛዕባና', 'om': 'Waa\'ee Keenya', 'rw': 'Ibyerekeye Twebwe', 'rn': 'Ibyerekeye Twebwe',
                    'lg': 'Ku bwe tutuukirira', 'ny': 'Za Ife', 'sn': 'Nezvedu', 'st': 'Ka Hona', 'tn': 'Ka Rona',
                    'ts': 'Hina', 've': 'Hina', 'wo': 'Ci Nu', 'ff': 'E dow', 'bm': 'An ka fɛ',
                    'dy': 'An ka fɛ', 'kab': 'Ɣef-nneɣ', 'shi': 'Ɣef-nneɣ', 'tzm': 'Ɣef-nneɣ', 'ber': 'Ɣef-nneɣ'
                  },
                  'Contact': {
                    'en': 'Contact', 'es': 'Contacto', 'fr': 'Contact', 'de': 'Kontakt',
                    'it': 'Contatto', 'pt': 'Contato', 'ru': 'Контакты', 'ja': 'お問い合わせ',
                    'ko': '연락처', 'zh': '联系我们', 'ar': 'اتصل بنا', 'hi': 'संपर्क करें', 'sw': 'Mawasiliano',
                    'am': 'አግኙን', 'ha': 'Tuntuɓe', 'yo': 'Kan Sọ', 'ig': 'Kpọtụrụ', 'zu': 'Xhumana', 'xh': 'Qhagamshelana',
                    'af': 'Kontak', 'so': 'La Xidhiidh', 'ti': 'ርክብ', 'om': 'Qunnamtii', 'rw': 'Vugurura', 'rn': 'Vugurura',
                    'lg': 'Okukwatagana', 'ny': 'Lumikizani', 'sn': 'Bata', 'st': 'Ikgokahanyo', 'tn': 'Tsamaisano',
                    'ts': 'Vhugani', 've': 'Vhugani', 'wo': 'Jëkkal', 'ff': 'Jokkondiral', 'bm': 'Dɔnni',
                    'dy': 'Dɔnni', 'kab': 'Aqqim', 'shi': 'Aqqim', 'tzm': 'Aqqim', 'ber': 'Aqqim'
                  },
                  'Get Started': {
                    'en': 'Get Started', 'es': 'Comenzar', 'fr': 'Commencer', 'de': 'Loslegen',
                    'it': 'Inizia', 'pt': 'Começar', 'ru': 'Начать', 'ja': '始める',
                    'ko': '시작하기', 'zh': '开始', 'ar': 'ابدأ', 'hi': 'शुरू करें', 'sw': 'Anza',
                    'am': 'ጀምር', 'ha': 'Fara', 'yo': 'Bẹrẹ', 'ig': 'Malite', 'zu': 'Qala', 'xh': 'Qala',
                    'af': 'Begin', 'so': 'Bilaaw', 'ti': 'ጅምር', 'om': 'Eegaluu', 'rw': 'Tangira', 'rn': 'Tangira',
                    'lg': 'Tandika', 'ny': 'Yambani', 'sn': 'Tanga', 'st': 'Qala', 'tn': 'Simolola',
                    'ts': 'Thoma', 've': 'Thoma', 'wo': 'Jëkk', 'ff': 'Fuɗɗi', 'bm': 'Daminɛ',
                    'dy': 'Daminɛ', 'kab': 'Bdu', 'shi': 'Bdu', 'tzm': 'Bdu', 'ber': 'Bdu'
                  },
                  'Get Quote': {
                    'en': 'Get Quote', 'es': 'Obtener Cotización', 'fr': 'Obtenir un Devis', 'de': 'Angebot Erhalten',
                    'it': 'Richiedi Preventivo', 'pt': 'Solicitar Orçamento', 'ru': 'Получить Предложение', 'ja': '見積もりを取得',
                    'ko': '견적 받기', 'zh': '获取报价', 'ar': 'احصل على عرض سعر', 'hi': 'कोटेशन प्राप्त करें', 'sw': 'Pata Bei',
                    'am': 'ዋጋ ማግኘት', 'ha': 'Samu Farashi', 'yo': 'Gba Iye', 'ig': 'Nweta Ọnụ', 'zu': 'Thola Isilinganiso', 'xh': 'Fumana Ixabiso',
                    'af': 'Kry Prys', 'so': 'Hel Qiimo', 'ti': 'ርክብ', 'om': 'Argadhu', 'rw': 'Shakisha', 'rn': 'Shakisha',
                    'lg': 'Funa Omugugu', 'ny': 'Pezani Mtengo', 'sn': 'Tora Mutengo', 'st': 'Fumana Tefo', 'tn': 'Fumana Tefo',
                    'ts': 'Wana Tefo', 've': 'Wana Tefo', 'wo': 'Jël Jagle', 'ff': 'Ɗaɓɓita', 'bm': 'Sigi',
                    'dy': 'Sigi', 'kab': 'Awi', 'shi': 'Awi', 'tzm': 'Awi', 'ber': 'Awi'
                  },
                  'Start Your Project': {
                    'en': 'Start Your Project', 'es': 'Inicia Tu Proyecto', 'fr': 'Commencez Votre Projet', 'de': 'Starten Sie Ihr Projekt',
                    'it': 'Inizia Il Tuo Progetto', 'pt': 'Inicie Seu Projeto', 'ru': 'Начните Свой Проект', 'ja': 'プロジェクトを開始',
                    'ko': '프로젝트 시작하기', 'zh': '开始您的项目', 'ar': 'ابدأ مشروعك', 'hi': 'अपना प्रोजेक्ट शुरू करें', 'sw': 'Anza Mradi Wako',
                    'am': 'ፕሮጀክትህን ጀምር', 'ha': 'Fara Aikin Ka', 'yo': 'Bẹrẹ Iṣẹ Rẹ', 'ig': 'Malite Ọrụ Gị', 'zu': 'Qala Iphrojekthi Yakho', 'xh': 'Qala Iphrojekthi Yakho',
                    'af': 'Begin Jou Projek', 'so': 'Bilaaw Mashruuckaaga', 'ti': 'ፕሮጀክትካ ጀምር', 'om': 'Eegaluu Hojiin Keessan', 'rw': 'Tangira Umushinga Wawe', 'rn': 'Tangira Umushinga Wawe',
                    'lg': 'Tandika Pulojekiti Yo', 'ny': 'Yambani Nchito Yanu', 'sn': 'Tanga Basa Rako', 'st': 'Qala Morero Wa Hao', 'tn': 'Simolola Morero Wa Hao',
                    'ts': 'Thoma Projeke Ya Wena', 've': 'Thoma Projeke Ya Wena', 'wo': 'Jëkk Jëfeka', 'ff': 'Fuɗɗi Golle Ma', 'bm': 'Daminɛ Baara',
                    'dy': 'Daminɛ Baara', 'kab': 'Bdu Aswen-nnek', 'shi': 'Bdu Aswen-nnek', 'tzm': 'Bdu Aswen-nnek', 'ber': 'Bdu Aswen-nnek'
                  },
                  'View Portfolio': {
                    'en': 'View Portfolio', 'es': 'Ver Portafolio', 'fr': 'Voir le Portfolio', 'de': 'Portfolio Ansehen',
                    'it': 'Visualizza Portfolio', 'pt': 'Ver Portfólio', 'ru': 'Посмотреть Портфолио', 'ja': 'ポートフォリオを見る',
                    'ko': '포트폴리오 보기', 'zh': '查看作品集', 'ar': 'عرض المحفظة', 'hi': 'पोर्टफोलियो देखें', 'sw': 'Angalia Portfolio',
                    'am': 'ፖርትፎሊዮ ተመልከት', 'ha': 'Duba Portfolio', 'yo': 'Wo Portfolio', 'ig': 'Lee Portfolio', 'zu': 'Bona I-Portfolio', 'xh': 'Jonga I-Portfolio',
                    'af': 'Bekyk Portfolio', 'so': 'Eeg Portfolio', 'ti': 'Portfolio ርእይ', 'om': 'Portfolio Ilaali', 'rw': 'Reba Portfolio', 'rn': 'Reba Portfolio',
                    'lg': 'Labako Portfolio', 'ny': 'Onani Portfolio', 'sn': 'Ona Portfolio', 'st': 'Bona Portfolio', 'tn': 'Bona Portfolio',
                    'ts': 'Vhonala Portfolio', 've': 'Vhonala Portfolio', 'wo': 'Seet Portfolio', 'ff': 'Yiiɗ Portfolio', 'bm': 'Portfolio Yɛrɛ',
                    'dy': 'Portfolio Yɛrɛ', 'kab': 'Ẓer Portfolio', 'shi': 'Ẓer Portfolio', 'tzm': 'Ẓer Portfolio', 'ber': 'Ẓer Portfolio'
                  },
                  'View Our Work': {
                    'en': 'View Our Work', 'es': 'Ver Nuestro Trabajo', 'fr': 'Voir Notre Travail', 'de': 'Unsere Arbeit Ansehen',
                    'it': 'Vedi Il Nostro Lavoro', 'pt': 'Ver Nosso Trabalho', 'ru': 'Посмотреть Нашу Работу', 'ja': '私たちの作品を見る',
                    'ko': '우리 작품 보기', 'zh': '查看我们的作品', 'ar': 'عرض أعمالنا', 'hi': 'हमारा काम देखें', 'sw': 'Angalia Kazi Yetu',
                    'am': 'ስራችንን ተመልከት', 'ha': 'Duba Aikin Mu', 'yo': 'Wo Iṣẹ Wa', 'ig': 'Lee Ọrụ Anyị', 'zu': 'Bona Umsebenzi Wethu', 'xh': 'Jonga Umsebenzi Wethu',
                    'af': 'Bekyk Ons Werk', 'so': 'Eeg Shaqadeena', 'ti': 'Shaqadeena ርእይ', 'om': 'Hojii Keenyatti Ilaali', 'rw': 'Reba Akazi Kacu', 'rn': 'Reba Akazi Kacu',
                    'lg': 'Labako Emirimu Gyaffe', 'ny': 'Onani Ntchito Zathu', 'sn': 'Ona Basa Redu', 'st': 'Bona Mosebetsi Wa Rona', 'tn': 'Bona Mosebetsi Wa Rona',
                    'ts': 'Vhonala Mushumo Wa Hone', 've': 'Vhonala Mushumo Wa Hone', 'wo': 'Seet Jëfeka', 'ff': 'Yiiɗ Golle Amen', 'bm': 'Baara Yɛrɛ',
                    'dy': 'Baara Yɛrɛ', 'kab': 'Ẓer Uswen-nneɣ', 'shi': 'Ẓer Uswen-nneɣ', 'tzm': 'Ẓer Uswen-nneɣ', 'ber': 'Ẓer Uswen-nneɣ'
                  }
                };
                
                // Detect language
                function detectLanguage() {
                  const browserLang = navigator.language || navigator.userLanguage || 'en';
                  const langCode = browserLang.split('-')[0].toLowerCase();
                  const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh', 'ar', 'hi', 'sw', 'am', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'so', 'ti', 'om', 'rw', 'rn', 'lg', 'ny', 'sn', 'st', 'tn', 'ts', 've', 'wo', 'ff', 'bm', 'dy', 'kab', 'shi', 'tzm', 'ber', 'kik', 'luy', 'kam', 'mer', 'emb', 'kln', 'mas', 'sag', 'teo', 'cgg', 'nyn', 'nso', 'ss', 'nr', 'nbl', 'nd', 'tsn', 'tso', 'ven', 'xho', 'zul'];
                  
                  console.log('Browser language detected:', browserLang);
                  console.log('Language code:', langCode);
                  console.log('Supported languages:', supportedLanguages);
                  
                  const detectedLang = supportedLanguages.includes(langCode) ? langCode : 'en';
                  console.log('Selected language:', detectedLang);
                  
                  return detectedLang;
                }
                
                // Translate page
                function translatePage() {
                  const language = detectLanguage();
                  const elements = document.querySelectorAll('[data-translate]');
                  
                  elements.forEach((element) => {
                    const key = element.getAttribute('data-translate');
                    if (key && translations[key]) {
                      const translation = translations[key][language] || translations[key]['en'];
                      element.textContent = translation;
                    }
                  });
                }
                
                // Initialize when DOM is ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', translatePage);
                } else {
                  translatePage();
                }
              })();
            `,
          }}
        />
        
        
        
        
        <style dangerouslySetInnerHTML={{
          __html: `
            link[rel="icon"] {
              background: #0f172a;
              border-radius: 4px;
            }
          `
        }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
