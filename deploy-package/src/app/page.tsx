import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Testimonials from '@/components/Testimonials'

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
