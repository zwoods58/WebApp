// Test what HTML is actually being served
async function testActualHTML() {
  try {
    console.log('Testing actual HTML content...');
    
    const response = await fetch('https://atarwebb.com/admin/import');
    
    if (response.status === 200) {
      const html = await response.text();
      
      // Save the HTML to a file for inspection
      const fs = require('fs');
      fs.writeFileSync('admin-import-page.html', html);
      console.log('✅ HTML saved to admin-import-page.html');
      
      // Check for specific elements
      console.log('Checking for specific elements:');
      console.log('- "Choose Import Method":', html.includes('Choose Import Method'));
      console.log('- "Paste from Google Sheets":', html.includes('Paste from Google Sheets'));
      console.log('- "importMode":', html.includes('importMode'));
      console.log('- "setImportMode":', html.includes('setImportMode'));
      console.log('- "textarea":', html.includes('textarea'));
      
      // Check if it's a client-side rendered component
      if (html.includes('__NEXT_DATA__')) {
        console.log('✅ Next.js app detected');
      }
      
      if (html.includes('FlexibleImport')) {
        console.log('✅ FlexibleImport component found');
      } else {
        console.log('❌ FlexibleImport component not found');
      }
      
    } else {
      console.log('❌ Could not fetch page:', response.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testActualHTML();


