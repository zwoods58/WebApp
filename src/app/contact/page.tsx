import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Contact from '@/components/Contact'
import ContactInfo from '@/components/ContactInfo'

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Contact />
        <ContactInfo />
      </main>
      <Footer />
    </>
  )
}
