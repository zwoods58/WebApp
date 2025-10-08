import Hero from '@/components/Hero'
import WhatWeDo from '@/components/WhatWeDo'
import WhyItMatters from '@/components/WhyItMatters'
import CompetitiveAdvantage from '@/components/CompetitiveAdvantage'
import OurProcess from '@/components/OurProcess'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <WhatWeDo />
        <WhyItMatters />
        <CompetitiveAdvantage />
        <OurProcess />
      </div>
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <CTA />
      </div>
    </div>
  )
}
