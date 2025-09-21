import Header from '@/components/Header'
import Footer from '@/components/Footer'
import About from '@/components/About'
import Team from '@/components/Team'
import Values from '@/components/Values'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <About />
        <Team />
        <Values />
      </main>
      <Footer />
    </>
  )
}
