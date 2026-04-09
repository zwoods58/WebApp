import translations from '../translations-new';

// Cache-busting timestamp to force refresh translations
const TRANSLATION_CACHE_BUSTER = Date.now();

// Type definitions for translation system
interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface TranslationValue {
  [language: string]: string;
}

/**
 * Smart translation function that handles industry-specific and common translations
 * 
 * @param key - Translation key (e.g., 'common.save', 'tailor.orders.title')
 * @param language - Target language code (e.g., 'en', 'sw', 'ha')
 * @param industry - Industry context (e.g., 'tailor', 'retail', 'salon')
 * @param defaultText - Fallback text if translation is not found
 * @param vars - Variables to interpolate in the translation text
 * @returns Translated text or default text
 */
export default function smartTranslate(
  key: string,
  language: string = 'en',
  industry?: string,
  defaultText?: string,
  vars?: Record<string, any>
): string {
  try {
    // Split the key into parts (e.g., 'tailor.orders.title' -> ['tailor', 'orders', 'title'])
    const keyParts = key.split('.');
    
    // Try to find the translation in the translations object
    let translation: TranslationValue | null = null;
    
    // FIRST: Try universal section for any key (most efficient)
    const universalTranslations = translations.universal as TranslationObject;
    if (universalTranslations && universalTranslations[key]) {
      translation = universalTranslations[key] as TranslationValue;
    }
    
    // SECOND: Try industry-specific sections if not found in universal
    if (!translation && keyParts.length >= 1) {
      const industrySection = keyParts[0]; // e.g., 'tailor', 'retail', etc.
      const industryTranslations = translations[industrySection as keyof typeof translations] as TranslationObject;
      if (industryTranslations && industryTranslations[key]) {
        // For industry-specific sections, the full key is stored
        translation = industryTranslations[key] as TranslationValue;
      }
    }
    
    // If translation is found and is an object with language keys
    if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
      // Check if the language exists in the translation
      if (language in translation) {
        let translatedText = translation[language];
        
        // Handle variable interpolation
        if (vars && typeof translatedText === 'string') {
          for (const [varKey, varValue] of Object.entries(vars)) {
            translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
          }
        }
        
        return translatedText;
      }
      
      // Fallback to English if target language not available
      if ('en' in translation) {
        let translatedText = translation.en;
        
        // Handle variable interpolation
        if (vars && typeof translatedText === 'string') {
          for (const [varKey, varValue] of Object.entries(vars)) {
            translatedText = translatedText.replace(new RegExp(`{{${varKey}}}`, 'g'), String(varValue));
          }
        }
        
        return translatedText;
      }
    }
    
    // If no translation found, return default text or key
    return defaultText || key;
    
  } catch (error) {
    console.error('Translation error:', error);
    return defaultText || key;
  }
}
