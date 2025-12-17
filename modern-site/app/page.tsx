import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import { ScrollDrivenHero } from '../src/components/sections/ScrollDrivenHero'
import { ValueProposition } from '../src/components/sections/ValueProposition'
import { PageHeader } from '../src/components/sections/PageHeader'

export const metadata: Metadata = {
  title: 'Affordable Website Design | Professional Web Development Services',
  description: 'I need a website for my business. Get affordable, professional website design services. Fast website setup, cheap online stores, mobile-friendly websites. Serving South Africa, Kenya, Rwanda, and across Africa.',
  keywords: [
    // High-Intent Problem Solving Keywords
    'I need a website for my business', 'create a website for my company', 'build an online store', 'get a cheap website for my business', 'fast website design', 'business website urgently', 'professional website cheap', 'small business online presence', 'how to get a business website', 'start selling online website', 'make my business appear on google', 'website for small shops', 'website for salons', 'website for barbers', 'website for churches', 'website for schools', 'website for NGOs', 'real estate website design', 'restaurant online ordering website', 'hotel booking website design', 'booking website for clinics', 'ecommerce website for SMEs', 'digital marketing and website bundle', 'affordable web hosting and design', 'fast website setup', 'website under R1000', 'website under KES 10,000', 'website under RWF 50,000', 'pay monthly website', 'subscription website design', 'website with whatsapp button', 'SEO website design', 'google ranking website', 'mobile-friendly business website', 'cheap online store design', 'website for startups', 'online marketplace website', 'classified ads website design', 'membership website design', 'landing page for ads', 'wordpress ecommerce', 'shopify store setup', 'wix website setup', 'business portfolio website', 'contractor website design', 'plumber website design', 'electrician website design', 'taxi booking website design', 'logistics company website', 'freight company website', 'construction website design', 'cleaning company website', 'law firm website design', 'consulting company website', 'accounting website design', 'HR agency website design', 'recruitment website design', 'event booking website', 'food delivery website design', 'marketplace web development',
    // Ultra-Specific High-Intent Keywords
    'create website with whatsapp chat', 'fast ecommerce website setup africa', 'cheap business website africa', 'website under $50 africa', 'website builders for african businesses', 'mpesa friendly website design', 'mobile-first website africa', 'african small business online store', 'get website for my business africa', 'affordable wordpress ecommerce africa', 'website for local shops africa', 'fast website for startups africa', 'website with instant payment integration', 'african business digital transformation', 'website for women entrepreneurs africa', 'website for youth businesses africa', 'website for freelancers africa', 'africa small business online presence', 'ecommerce marketplace africa', 'cheap landing page africa'
  ],
}

// Dynamically import heavy components to reduce initial bundle size
const GalleryQuote = dynamic(() => import('../src/components/sections/GalleryQuote').then(mod => ({ default: mod.GalleryQuote })), { ssr: false })
const WhyChooseAtarWebb = dynamic(() => import('../src/components/sections/WhyChooseAtarWebb').then(mod => ({ default: mod.WhyChooseAtarWebb })), { ssr: false })
const Portfolio = dynamic(() => import('../src/components/sections/Portfolio').then(mod => ({ default: mod.Portfolio })), { ssr: false })
const Testimonials = dynamic(() => import('../src/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })), { ssr: false })
const FAQ = dynamic(() => import('../src/components/sections/FAQ').then(mod => ({ default: mod.FAQ })), { ssr: false })
const CTAWithFooter = dynamic(() => import('../src/components/sections/CTAWithFooter').then(mod => ({ default: mod.CTAWithFooter })), { ssr: false })

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black" style={{ width: '100%', overflowX: 'hidden', margin: 0, padding: 0 }}>
      <PageHeader />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white"
      >
        Skip to main content
      </a>
      <main 
        id="main" 
        className="relative"
        style={{
          width: '100%',
          willChange: 'scroll-position',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        <div className="relative" style={{ position: 'relative', width: '100%', margin: 0, padding: 0 }}>
          <ScrollDrivenHero />
        </div>
        <GalleryQuote />
        <WhyChooseAtarWebb />
        <ValueProposition />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <CTAWithFooter />
      </main>
    </div>
  )
}

