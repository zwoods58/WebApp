import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Program - Earn 20% Commission Referring Clients',
  description: 'Join AtarWebb\'s Partner Program and earn 20% commission on every client referral. Fast PayPal payouts, marketing materials provided. Partner with us to grow your income while helping businesses succeed.',
  keywords: ['partner program', 'affiliate program', 'web design referral', 'earn commission', 'referral program', 'partnership opportunity'],
  openGraph: {
    title: 'AtarWebb Partner Program - Earn 20% Commission',
    description: 'Join our Partner Program and earn 20% commission on every client referral. Fast PayPal payouts, marketing materials provided.',
    url: 'https://atarwebb.com/partner-program',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AtarWebb Partner Program - Earn 20% Commission',
    description: 'Join our Partner Program and earn 20% commission on every client referral.',
  },
}

export default function PartnerProgramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

