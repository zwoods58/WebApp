import universalTranslations from '../universal-translations';
import industryTranslations from './industry-translations';
import essentialTranslations from './essential-translations';

// Cache-busting timestamp to force refresh translations
const TRANSLATION_CACHE_BUSTER = Date.now();

// Log the number of keys loaded
console.log(`[TRANSLATION] Universal keys loaded: ${Object.keys(universalTranslations.universal || {}).length}`);
console.log(`[TRANSLATION] Sample keys:`, Object.keys(universalTranslations.universal || {}).slice(0, 5));

// Type definitions for translation system
interface TranslationObject {
  [key: string]: string | TranslationObject;
}

interface TranslationValue {
  [language: string]: string;
}

interface EssentialTranslations {
  [key: string]: TranslationValue;
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
    // DEBUG: Log translation lookup
    console.log(`[TRANSLATION] Looking up key: ${key}, language: ${language}, industry: ${industry}`);
    
    // Split the key into parts (e.g., 'tailor.orders.title' -> ['tailor', 'orders', 'title'])
    const keyParts = key.split('.');
    
    // Try to find the translation in the translations object
    let translation: TranslationValue | null = null;
    
    // DEBUG: Check if universalTranslations is loaded
    console.log(`[TRANSLATION] universalTranslations loaded:`, !!universalTranslations);
    console.log(`[TRANSLATION] universalSection exists:`, !!universalTranslations?.universal);
    
    // FIRST: Try universal section for any key (most efficient)
    const universalSection = universalTranslations.universal as Record<string, TranslationValue>;
    if (universalSection && universalSection[key]) {
      translation = universalSection[key] as TranslationValue;
      console.log(`[TRANSLATION] Found in universal: ${key}`);
    }
    
    // SECOND: Try industry-specific sections if not found in universal
    if (!translation && keyParts.length >= 1) {
      const industrySection = keyParts[0]; // e.g., 'tailor', 'retail', etc.
      const industrySectionTranslations = industryTranslations[industrySection as keyof typeof industryTranslations] as TranslationObject;
      if (industrySectionTranslations && industrySectionTranslations[key]) {
        // For industry-specific sections, the full key is stored
        translation = industrySectionTranslations[key] as TranslationValue;
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
    
    // THIRD: Try essential translations as fallback
    if ((essentialTranslations as EssentialTranslations)[key]) {
      const essentialTranslation = (essentialTranslations as EssentialTranslations)[key];
      if (language in essentialTranslation) {
        console.log(`[TRANSLATION] Found in essential: ${key}`);
        return essentialTranslation[language];
      }
      // Fallback to English in essential translations
      if ('en' in essentialTranslation) {
        console.log(`[TRANSLATION] Found in essential (English fallback): ${key}`);
        return essentialTranslation.en;
      }
    }
    
    // DEBUG: Log when translation is not found
    console.log(`[TRANSLATION] NOT FOUND: ${key}, returning default: ${defaultText || key}`);
    
    // FOURTH: Return default text or key as last resort
    return defaultText || key;
    
  } catch (error) {
    console.error('Translation error:', error);
    // Try essential translations as error fallback
    try {
      if ((essentialTranslations as EssentialTranslations)[key]) {
        const essentialTranslation = (essentialTranslations as EssentialTranslations)[key];
        if (language in essentialTranslation) {
          return essentialTranslation[language];
        }
        if ('en' in essentialTranslation) {
          return essentialTranslation.en;
        }
      }
    } catch (fallbackError) {
      console.error('Fallback translation error:', fallbackError);
    }
    return defaultText || key;
  }
}
