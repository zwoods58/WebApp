import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || ''
  const from = searchParams.get('from') || 'auto'
  const to = searchParams.get('to') || 'en'

  // Simple translation mapping (in a real app, you'd use a translation API)
  const translations: { [key: string]: { [key: string]: string } } = {
    'hello': {
      'sw': 'hujambo',
      'fr': 'bonjour',
      'es': 'hola',
      'de': 'hallo',
      'it': 'ciao',
      'pt': 'olá',
      'ar': 'مرحبا',
      'hi': 'नमस्ते',
      'zh': '你好',
      'ja': 'こんにちは',
      'ko': '안녕하세요',
      'ru': 'привет'
    },
    'web development': {
      'sw': 'maendeleo ya wavuti',
      'fr': 'développement web',
      'es': 'desarrollo web',
      'de': 'webentwicklung',
      'it': 'sviluppo web',
      'pt': 'desenvolvimento web',
      'ar': 'تطوير المواقع',
      'hi': 'वेब विकास',
      'zh': '网站开发',
      'ja': 'ウェブ開発',
      'ko': '웹 개발',
      'ru': 'веб-разработка'
    },
    'services': {
      'sw': 'huduma',
      'fr': 'services',
      'es': 'servicios',
      'de': 'dienstleistungen',
      'it': 'servizi',
      'pt': 'serviços',
      'ar': 'خدمات',
      'hi': 'सेवाएं',
      'zh': '服务',
      'ja': 'サービス',
      'ko': '서비스',
      'ru': 'услуги'
    }
  }

  // Simple translation logic
  const translatedText = translations[text.toLowerCase()]?.[to] || text

  return NextResponse.json({
    text: translatedText,
    from: from,
    to: to,
    original: text
  })
}
