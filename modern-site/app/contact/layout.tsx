import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get Your Custom Website Quote',
  description: 'Contact AtarWebb for a free consultation and custom website quote. Reach us at +254 758 557 779 or fill out our contact form. Professional web development services across Africa and America.',
  keywords: [
    // Contact & Quote Keywords
    'contact web developer', 'website quote', 'web design consultation', 'custom website inquiry', 'AtarWebb contact', 'get website quote', 'free website consultation', 'website design quote', 'custom website quote',
    // Location-Specific Contact Keywords - South Africa
    'contact website designer durban', 'website quote johannesburg', 'web design consultation cape town', 'contact web developers south africa', 'website designers durban contact', 'johannesburg web design quote', 'cape town website consultation', 'pretoria web developers contact', 'durban website quote', 'south africa web design inquiry',
    // Location-Specific Contact Keywords - Kenya
    'contact website designers nairobi', 'website quote kenya', 'nairobi web design consultation', 'contact web developers kenya', 'mombasa website designers contact', 'kenya website quote', 'nairobi custom website quote', 'kenya web development inquiry', 'contact nairobi web developers', 'kenya website consultation',
    // Location-Specific Contact Keywords - Rwanda
    'contact website designers kigali', 'website quote rwanda', 'kigali web design consultation', 'contact web developers rwanda', 'rwanda website quote', 'kigali custom website quote', 'rwanda web development inquiry', 'contact kigali web developers', 'rwanda website consultation',
    // Service-Specific Contact Keywords
    'affordable website design for small business south africa', 'fast website design durban', 'urgent website design south africa', 'fast website design kenya', 'urgent website kenya', 'fast website design kigali', 'urgent website rwanda', 'mobile friendly website south africa', 'wordpress support kenya', 'wordpress support rwanda', 'wordpress maintenance south africa', 'wordpress maintenance kenya', 'wordpress maintenance rwanda', 'website redesign services south africa', 'website redesign kenya', 'website redesign rwanda'
  ],
  openGraph: {
    title: 'Contact AtarWebb - Get Your Custom Website Quote',
    description: 'Contact us for a free consultation and custom website quote. Professional web development services.',
    url: 'https://atarwebb.com/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact AtarWebb - Get Your Custom Website Quote',
    description: 'Contact us for a free consultation and custom website quote.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

