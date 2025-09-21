import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import Process from '@/components/Process'

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Services />
        <Pricing />
        <Process />
      </main>
      <Footer />
    </>
  )
}
