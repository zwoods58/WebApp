import translations from './translations-new.js';

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
  key,
  language = 'en',
  industry,
  defaultText,
  vars
) {
  try {
    // Split the key into parts (e.g., 'tailor.orders.title' -> ['tailor', 'orders', 'title'])
    const keyParts = key.split('.');
    
    // Try to find the translation in the translations object
    let translation = null;
    
    // FIRST: Try universal section for ANY key (most efficient and future-proof)
    if (translations.universal && translations.universal[key]) {
      translation = translations.universal[key];
      
      // Apply language selection
      if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
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
    }
    
    // SECOND: Try main translations object for prefixed keys (backward compatibility)
    if (!translation && keyParts.length >= 2) {
      const universalPrefixes = [
        'nav.', 'common.', 'greeting.', 'home.', 'target.', 'share.',
        'country.', 'staff_performance.', 'business.', 'alert.'
      ];
      
      if (universalPrefixes.some(prefix => key.startsWith(prefix))) {
        if (translations[key]) {
          translation = translations[key];
          
          // Apply language selection
          if (translation && typeof translation === 'object' && !Array.isArray(translation)) {
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
        }
      }
    }
    
    // Also try universal section for modal and form keys that don't have prefixes
    const modalAndFormKeys = ['addItemModalTitle', 'itemName', 'enterItemName', 'category', 'selectCategory', 'costPrice', 'sellingPrice', 'quantity', 'lowStockAlert', 'alertWhenBelow', 'units', 'cancel', 'save', 'add', 'edit', 'delete', 'search', 'searchItems', 'noItemsYet', 'inventoryEmptyDescription', 'addItemButton', 'stock', 'stockSubtitle', 'totalProducts', 'runningLowLabel', 'quickActions', 'addItem', 'stockTake', 'inventory', 'sell', 'sellSubtitle', 'retailMode', 'quickItems', 'allProducts', 'available', 'inStock', 'currentSale', 'total', 'clearSale', 'paymentMethod', 'customerName', 'searchCustomers', 'dueDate', 'amountPaid', 'balanceDue', 'completeSale', 'paid', 'credit', 'partial', 'today', 'tomorrow', 'thisWeek', 'nextWeek', 'each', 'noResults', 'tryDifferentSearch', 'noItemsAdded', 'addFirstItemToStart', 'trackItems', 'viewMore', 'fullCashPaymentConfirmed', 'dailyTarget', 'moneyIn', 'moneyOut', 'startingCash', 'welcomeBack', 'achieved', 'of', 'nav.home', 'nav.more', 'home.starting_cash', 'common.money_in', 'common.money_out', 'home.quick_actions', 'common.record_income', 'common.record_expense', 'common.count_cash', 'common.reconcile_cash', 'common.end_day', 'common.close_day_fresh', 'common.view_all', 'common.expected', 'common.actual', 'common.difference', 'common.who_owes_you', 'common.no_outstanding_credit', 'greeting.welcome_back', 'target.achieved', 'target.of'];
    
    // Try universal section for modal and form keys
    if (!translation && modalAndFormKeys.includes(key)) {
      translation = translations.universal[key];
    }
    
    // If not found in universal, try industry-specific sections (tailor, retail, etc.)
    if (!translation && keyParts.length >= 1) {
      const industrySection = keyParts[0]; // e.g., 'tailor', 'retail', etc.
      if (translations[industrySection]) {
        // For industry-specific sections, the full key is stored (e.g., "tailor.jobs")
        // So we look for the complete key, not navigate through parts
        translation = translations[industrySection][key];
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
