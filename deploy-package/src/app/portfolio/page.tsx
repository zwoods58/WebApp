import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Portfolio from '@/components/Portfolio'
import CaseStudy from '@/components/CaseStudy'

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Portfolio />
        <CaseStudy />
      </main>
      <Footer />
    </>
  )
}
