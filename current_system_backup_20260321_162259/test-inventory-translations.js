// Test script to verify translations work for food/retail inventory
// Run this in browser console

function testFoodRetailInventoryTranslations() {
  console.log('🌐 Testing Food & Retail Inventory Translations');
  console.log('=============================================');
  
  // Test 1: Check current page and industry
  console.log('\n🔍 Test 1: Page and Industry Detection');
  
  const currentPath = window.location.pathname;
  const urlParts = currentPath.split('/');
  const industryIndex = urlParts.indexOf('app') + 2;
  const industry = urlParts[industryIndex] || 'unknown';
  
  console.log('📍 Current path:', currentPath);
  console.log('🏭 Industry:', industry);
  console.log('🍽️ Food/Retail:', ['food', 'retail'].includes(industry));
  
  // Test 2: Check page title
  console.log('\n📄 Test 2: Page Title Translation');
  
  const pageTitle = document.querySelector('h1')?.textContent;
  console.log('📄 Page title:', pageTitle);
  
  const expectedTitle = ['food', 'retail'].includes(industry) ? 'Inventory' : 'Services';
  const titleCorrect = pageTitle === expectedTitle;
  console.log('✅ Title correct:', titleCorrect ? 'Yes' : 'No');
  
  // Test 3: Check key inventory elements and their translations
  console.log('\n📦 Test 3: Inventory Element Translations');
  
  const inventoryElements = {
    'Total Items': document.querySelector('[data-testid="total-items"]') || 
                     Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Total Items')),
    'Low Stock': document.querySelector('[data-testid="low-stock"]') || 
                 Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Low Stock')),
    'Inventory Value': document.querySelector('[data-testid="inventory-value"]') || 
                      Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Inventory Value')),
    'Add Item': document.querySelector('[data-testid="add-item"]') || 
               Array.from(document.querySelectorAll('button')).find(el => el.textContent?.includes('Add')),
    'Search': document.querySelector('input[placeholder*="Search"]') ||
             document.querySelector('input[placeholder*="Tafuta"]') ||
             document.querySelector('input[placeholder*="Bincika"]')
  };
  
  Object.entries(inventoryElements).forEach(([key, element]) => {
    if (element) {
      const text = element.textContent || element.placeholder || '';
      console.log(`✅ ${key}: "${text.trim()}"`);
    } else {
      console.log(`❌ ${key}: Not found`);
    }
  });
  
  // Test 4: Check for translation indicators
  console.log('\n🌍 Test 4: Translation Language Detection');
  
  const pageText = document.body.innerText || '';
  
  const languageIndicators = {
    'English': /\b(Total Items|Low Stock|Inventory Value|Add Item|Search)\b/,
    'Swahili': /\b(Vitu Vyote|Hifadhi Chini|Thamani ya Hifadhi|Ongeza Kifungu|Tafuta)\b/,
    'Hausa': /\b(Jimillar Kaya|Kayayyaki Kadan|Darajar Kayayyaki|Ɗaya Kaya|Bincika)\b/,
    'Yoruba': /\b(Gbápọ̀ Nkan|Ọja Kékè|Iye Inivitori|Fi Nkan|Wa nkan)\b/
  };
  
  let detectedLanguage = 'Unknown';
  Object.entries(languageIndicators).forEach(([lang, regex]) => {
    if (regex.test(pageText)) {
      detectedLanguage = lang;
    }
  });
  
  console.log('🌍 Detected language:', detectedLanguage);
  
  // Test 5: Verify no hardcoded English text for food/retail
  console.log('\n🔍 Test 5: Hardcoded Text Check');
  
  if (['food', 'retail'].includes(industry)) {
    const hardcodedEnglishPatterns = [
      /Total Items/,
      /Low Stock/,
      /Inventory Value/,
      /Add Item/,
      /Search inventory/,
      /No inventory items found/,
      /Stock running low/
    ];
    
    const hasHardcodedText = hardcodedEnglishPatterns.some(pattern => pattern.test(pageText));
    console.log('🚫 Hardcoded English found:', hasHardcodedText ? 'Yes (Issue!)' : 'No (Good!)');
    
    if (hasHardcodedText) {
      console.log('⚠️ Some elements are still in English - translation may not be working');
    } else {
      console.log('✅ All text appears to be translated');
    }
  }
  
  // Test 6: Check translation function availability
  console.log('\n🔧 Test 6: Translation Function Check');
  
  // Try to access the translation function (if available globally)
  if (typeof window !== 'undefined' && window.t) {
    console.log('✅ Translation function available globally');
    
    // Test some translation keys
    const testKeys = [
      'services.total_items',
      'services.low_stock', 
      'services.inventory_value',
      'add_stock',
      'services.search_inventory'
    ];
    
    testKeys.forEach(key => {
      try {
        const translation = window.t(key);
        console.log(`✅ ${key}: "${translation}"`);
      } catch (error) {
        console.log(`❌ ${key}: Error - ${error.message}`);
      }
    });
  } else {
    console.log('❌ Translation function not available globally');
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Industry: ${industry}`);
  console.log(`✅ Page title: ${titleCorrect ? 'Correct' : 'Incorrect'}`);
  console.log(`✅ Language: ${detectedLanguage}`);
  console.log(`✅ Translation status: ${titleCorrect && !hardcodedEnglishPatterns.some(p => p.test(pageText)) ? 'Working' : 'Needs Fix'}`);
  
  console.log('\n💡 Expected Results:');
  console.log('• Food/Retail should show "Inventory" page title');
  console.log('• All inventory elements should be translated');
  console.log('• No hardcoded English text should remain');
  console.log('• Translation keys should work properly');
  
  console.log('\n🎉 Translation test complete!');
}

console.log('🚀 Running food/retail inventory translation test...');
testFoodRetailInventoryTranslations();
