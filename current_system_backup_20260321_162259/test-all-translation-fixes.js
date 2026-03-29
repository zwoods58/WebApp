// Comprehensive test to verify all translation fixes for food/retail inventory
// Run this in browser console

function testAllTranslationFixes() {
  console.log('🌐 Comprehensive Translation Fix Test for Food & Retail');
  console.log('==================================================');
  
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
  
  // Test 3: Check inventory summary cards
  console.log('\n📊 Test 3: Inventory Summary Cards');
  
  const summaryCards = [
    { key: 'total_items', selector: () => Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Total Items') || el.textContent?.includes('Jumla ya Vitu')) },
    { key: 'low_stock', selector: () => Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Low Stock') || el.textContent?.includes('Hifadhi Chini')) },
    { key: 'total_stock_value', selector: () => Array.from(document.querySelectorAll('*')).find(el => el.textContent?.includes('Total Stock Value') || el.textContent?.includes('Thamani Jumla ya Hifadhi')) }
  ];
  
  summaryCards.forEach(card => {
    const element = card.selector();
    if (element) {
      const text = element.textContent?.trim();
      console.log(`✅ ${card.key}: "${text}"`);
    } else {
      console.log(`❌ ${card.key}: Not found`);
    }
  });
  
  // Test 4: Check action buttons
  console.log('\n🔘 Test 4: Action Buttons');
  
  const buttons = [
    { key: 'add_item', selector: () => Array.from(document.querySelectorAll('button')).find(el => el.textContent?.includes('Add New Item') || el.textContent?.includes('Ongeza Kipya')) },
    { key: 'search', selector: () => document.querySelector('input[placeholder*="Search"]') || document.querySelector('input[placeholder*="Tafuta"]') }
  ];
  
  buttons.forEach(button => {
    const element = button.selector();
    if (element) {
      const text = element.textContent || element.placeholder || '';
      console.log(`✅ ${button.key}: "${text.trim()}"`);
    } else {
      console.log(`❌ ${button.key}: Not found`);
    }
  });
  
  // Test 5: Check form labels (if modal is open)
  console.log('\n📝 Test 5: Form Labels (Modal Check)');
  
  const modalElement = document.querySelector('[class*="fixed"]');
  if (modalElement) {
    const formLabels = [
      { key: 'item_name', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Item Name') || el.textContent?.includes('Jina la Kiumu')) },
      { key: 'category', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Category') || el.textContent?.includes('Aina')) },
      { key: 'quantity', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Quantity') || el.textContent?.includes('Idadi')) },
      { key: 'min_stock', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Min') || el.textContent?.includes('Chini')) },
      { key: 'units', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Units') || el.textContent?.includes('vitu')) },
      { key: 'suppliers', selector: () => Array.from(modalElement.querySelectorAll('label')).find(el => el.textContent?.includes('Suppliers') || el.textContent?.includes('Wauzaji')) }
    ];
    
    formLabels.forEach(label => {
      const element = label.selector();
      if (element) {
        const text = element.textContent?.trim();
        console.log(`✅ ${label.key}: "${text}"`);
      } else {
        console.log(`❌ ${label.key}: Not found`);
      }
    });
    
    // Check submit button
    const submitButton = Array.from(modalElement.querySelectorAll('button')).find(el => el.textContent?.includes('Add New Item') || el.textContent?.includes('Ongeza Kipya'));
    if (submitButton) {
      console.log(`✅ Submit button: "${submitButton.textContent.trim()}"`);
    } else {
      console.log('❌ Submit button: Not found');
    }
  } else {
    console.log('ℹ️ Modal not open - Open "Add Item" to test form labels');
  }
  
  // Test 6: Check for hardcoded English text
  console.log('\n🚫 Test 6: Hardcoded English Text Check');
  
  const pageText = document.body.innerText || '';
  
  const hardcodedEnglishPatterns = [
    { pattern: /\bTotal Items\b/, description: 'Total Items' },
    { pattern: /\bLow Stock\b/, description: 'Low Stock' },
    { pattern: /\bInventory Value\b/, description: 'Inventory Value' },
    { pattern: /\bAdd Item\b/, description: 'Add Item' },
    { pattern: /\bSearch inventory\b/, description: 'Search inventory' },
    { pattern: /\bItem Name\b/, description: 'Item Name' },
    { pattern: /\bCategory\b/, description: 'Category' },
    { pattern: /\bQuantity\b/, description: 'Quantity' },
    { pattern: /\bMin\. Stock\b/, description: 'Min. Stock' },
    { pattern: /\bUnits\b/, description: 'Units' },
    { pattern: /\bSupplier\b/, description: 'Supplier' },
    { pattern: /\bMin:\s*\d+\b/, description: 'Min: [number]' },
    { pattern: /\bNo inventory items found\b/, description: 'No inventory items found' },
    { pattern: /\bStock running low\b/, description: 'Stock running low' }
  ];
  
  const foundHardcodedText = [];
  hardcodedEnglishPatterns.forEach(({ pattern, description }) => {
    if (pattern.test(pageText)) {
      foundHardcodedText.push(description);
    }
  });
  
  if (foundHardcodedText.length > 0) {
    console.log('⚠️ Hardcoded English text found:');
    foundHardcodedText.forEach(text => console.log(`  ❌ ${text}`));
  } else {
    console.log('✅ No hardcoded English text found');
  }
  
  // Test 7: Language detection
  console.log('\n🌍 Test 7: Language Detection');
  
  const languageIndicators = {
    'English': /\b(Total Items|Low Stock|Inventory Value|Add New Item|Search items|Item Name|Category|Quantity|Min Stock|Units|Suppliers)\b/,
    'Swahili': /\b(Jumla ya Vitu|Hifadhi Chini|Thamani Jumla ya Hifadhi|Ongeza Kipya|Tafuta vitu|Jina la Kiumu|Aina|Idadi|Chini|vitu|Wauzaji)\b/,
    'Hausa': /\b(Jimillar Kayayyaki|Kayayyaki Kadan|Darajar Jimillar Kayayyaki|Ƙara Sabo|Bincika kayayyaki|Sunan Kayan|Rabe|Yawa|Kasa|kayayyaki|Masu sayar da kayayyaki)\b/,
    'Yoruba': /\b(Gbápọ̀ Nkan|Ọja Kékè|Iye Lapapọ Inivitori|Fi Tuntun|Wa nkan|Jina Nkan|Ẹka|Iye|Kasa|nkan|Onjẹwọ)\b/
  };
  
  let detectedLanguage = 'Mixed/Unknown';
  Object.entries(languageIndicators).forEach(([lang, regex]) => {
    if (regex.test(pageText)) {
      detectedLanguage = lang;
    }
  });
  
  console.log('🌍 Detected language:', detectedLanguage);
  
  // Test 8: Overall assessment
  console.log('\n📊 Test 8: Overall Assessment');
  
  const isFoodOrRetail = ['food', 'retail'].includes(industry);
  const hasProperTranslations = foundHardcodedText.length === 0;
  const hasCorrectTitle = titleCorrect;
  
  console.log(`✅ Industry: ${industry}`);
  console.log(`✅ Page title: ${hasCorrectTitle ? 'Correct' : 'Incorrect'}`);
  console.log(`✅ Translation status: ${hasProperTranslations ? 'Working' : 'Needs Fix'}`);
  console.log(`✅ Language: ${detectedLanguage}`);
  
  const overallStatus = (titleCorrect && hasProperTranslations) ? 'PASS' : 'NEEDS ATTENTION';
  console.log(`\n🎯 Overall Status: ${overallStatus}`);
  
  console.log('\n💡 Expected Results:');
  console.log('• Food/Retail should show "Inventory" page title');
  console.log('• All inventory elements should be translated');
  console.log('• No hardcoded English text should remain');
  console.log('• Form labels should use proper translation keys');
  console.log('• All languages should work correctly');
  
  console.log('\n🎉 Translation fix test complete!');
  
  if (overallStatus === 'PASS') {
    console.log('🚀 All translation fixes are working correctly!');
  } else {
    console.log('⚠️ Some translation issues need attention');
  }
}

console.log('🚀 Running comprehensive translation fix test...');
testAllTranslationFixes();
