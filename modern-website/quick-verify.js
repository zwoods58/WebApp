// Quick test to verify the changes work
// Run this in browser console

function quickVerify() {
  console.log('🔍 Quick Verification of Food/Retail Services Removal');
  console.log('===============================================');
  
  // Check current page
  const currentPath = window.location.pathname;
  console.log('📍 Current path:', currentPath);
  
  // Extract industry from URL
  const urlParts = currentPath.split('/');
  const industryIndex = urlParts.indexOf('app') + 2;
  const industry = urlParts[industryIndex] || 'unknown';
  
  console.log('🏭 Industry:', industry);
  
  // Check if this is a food/retail industry
  const isFoodOrRetail = ['food', 'retail'].includes(industry);
  console.log('🍽️ Food/Retail industry:', isFoodOrRetail);
  
  // Expected behavior
  const expectedTitle = isFoodOrRetail ? 'Inventory' : 'Services';
  const expectedTabSlider = !isFoodOrRetail;
  
  console.log('📄 Expected page title:', expectedTitle);
  console.log('👁️ Expected tab slider:', expectedTabSlider ? 'Yes' : 'No');
  
  // Check actual page title
  const pageTitle = document.querySelector('h1')?.textContent;
  console.log('📄 Actual page title:', pageTitle);
  
  // Check for tab slider
  const tabSlider = document.querySelector('.bg-gray-100.rounded-xl.p-1.flex');
  console.log('👁️ Tab slider visible:', tabSlider ? 'Yes' : 'No');
  
  // Validation
  const titleCorrect = pageTitle === expectedTitle;
  const tabSliderCorrect = (tabSlider !== null) === expectedTabSlider;
  
  console.log('\n✅ Results:');
  console.log('Page title correct:', titleCorrect ? '✅' : '❌');
  console.log('Tab slider correct:', tabSliderCorrect ? '✅' : '❌');
  console.log('Overall:', (titleCorrect && tabSliderCorrect) ? '✅ WORKING' : '❌ NEEDS FIX');
  
  if (titleCorrect && tabSliderCorrect) {
    console.log('\n🎉 Implementation successful!');
    console.log('📱 Food and retail users see clean inventory interface');
    console.log('🔄 Other industries maintain full services functionality');
  } else {
    console.log('\n⚠️ Implementation needs adjustment');
  }
}

console.log('🚀 Running quick verification...');
quickVerify();
