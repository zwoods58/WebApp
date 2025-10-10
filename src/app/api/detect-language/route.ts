import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text') || ''

  // Simple language detection based on common words
  const languagePatterns = {
    'sw': ['hujambo', 'asante', 'karibu', 'sawa', 'ndiyo', 'hapana'],
    'fr': ['bonjour', 'merci', 'oui', 'non', 'comment', 'pourquoi'],
    'es': ['hola', 'gracias', 'sí', 'no', 'cómo', 'por qué'],
    'de': ['hallo', 'danke', 'ja', 'nein', 'wie', 'warum'],
    'it': ['ciao', 'grazie', 'sì', 'no', 'come', 'perché'],
    'pt': ['olá', 'obrigado', 'sim', 'não', 'como', 'por que'],
    'ar': ['مرحبا', 'شكرا', 'نعم', 'لا', 'كيف', 'لماذا'],
    'hi': ['नमस्ते', 'धन्यवाद', 'हाँ', 'नहीं', 'कैसे', 'क्यों'],
    'zh': ['你好', '谢谢', '是', '不', '怎么', '为什么'],
    'ja': ['こんにちは', 'ありがとう', 'はい', 'いいえ', 'どう', 'なぜ'],
    'ko': ['안녕하세요', '감사합니다', '예', '아니오', '어떻게', '왜'],
    'ru': ['привет', 'спасибо', 'да', 'нет', 'как', 'почему']
  }

  let detectedLanguage = 'en'
  let maxMatches = 0

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    const matches = patterns.filter(pattern => 
      text.toLowerCase().includes(pattern.toLowerCase())
    ).length
    
    if (matches > maxMatches) {
      maxMatches = matches
      detectedLanguage = lang
    }
  }

  return NextResponse.json({
    language: detectedLanguage,
    confidence: maxMatches > 0 ? Math.min(maxMatches / 3, 1) : 0.1,
    text: text
  })
}
