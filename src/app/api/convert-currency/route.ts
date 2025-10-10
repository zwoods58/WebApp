import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const amount = parseFloat(searchParams.get('amount') || '0')
  const from = searchParams.get('from') || 'USD'
  const to = searchParams.get('to') || 'KES'

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const exchangeRates: { [key: string]: number } = {
    'USD': 1,
    'KES': 130, // 1 USD = 130 KES
    'EUR': 0.85,
    'GBP': 0.73,
    'CAD': 1.25,
    'AUD': 1.35,
    'JPY': 110,
    'INR': 75,
    'ZAR': 15,
    'NGN': 410,
    'GHS': 6.5,
    'EGP': 31,
    'MAD': 9.5,
    'TND': 2.9,
    'DZD': 135,
    'LYD': 4.5,
    'SDG': 55,
    'ETB': 45,
    'UGX': 3700,
    'TZS': 2300,
    'RWF': 1050,
    'BIF': 2000,
    'KMF': 450,
    'DJF': 180,
    'SOS': 570,
    'ERN': 15,
    'SSP': 130,
    'AOA': 650,
    'BWP': 13.5,
    'LSL': 13.5,
    'SZL': 13.5,
    'ZMW': 18,
    'MWK': 820,
    'MZN': 64,
    'SLL': 10200,
    'GMD': 52,
    'GNF': 10200,
    'LRD': 190,
    'CDF': 2000,
    'XAF': 560,
    'XOF': 560,
    'XPF': 100,
    'KRW': 1200,
    'RUB': 75
  }

  const fromRate = exchangeRates[from] || 1
  const toRate = exchangeRates[to] || 1
  
  const convertedAmount = (amount * toRate) / fromRate

  const currencySymbols: { [key: string]: string } = {
    'USD': '$',
    'KES': 'KSh',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'INR': '₹',
    'ZAR': 'R',
    'NGN': '₦',
    'GHS': '₵',
    'EGP': '£',
    'MAD': 'د.م.',
    'TND': 'د.ت',
    'DZD': 'د.ج',
    'LYD': 'ل.د',
    'SDG': 'ج.س.',
    'ETB': 'Br',
    'UGX': 'USh',
    'TZS': 'TSh',
    'RWF': 'RF',
    'BIF': 'FBu',
    'KMF': 'CF',
    'DJF': 'Fdj',
    'SOS': 'S',
    'ERN': 'Nfk',
    'SSP': '£',
    'AOA': 'Kz',
    'BWP': 'P',
    'LSL': 'L',
    'SZL': 'E',
    'ZMW': 'ZK',
    'MWK': 'MK',
    'MZN': 'MT',
    'SLL': 'Le',
    'GMD': 'D',
    'GNF': 'FG',
    'LRD': 'L$',
    'CDF': 'FC',
    'XAF': 'FCFA',
    'XOF': 'FCFA',
    'XPF': '₣',
    'KRW': '₩',
    'RUB': '₽'
  }

  return NextResponse.json({
    amount: amount,
    from: from,
    to: to,
    convertedAmount: convertedAmount,
    formattedAmount: `${currencySymbols[to] || to}${convertedAmount.toFixed(2)}`,
    rate: toRate / fromRate
  })
}
