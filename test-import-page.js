// Test if the import page is accessible and has the new features
async function testImportPage() {
  try {
    console.log('Testing import page...');
    
    const response = await fetch('https://atarwebb.com/admin/import');
    
    console.log('Response status:', response.status);
    
    if (response.status === 200) {
      const html = await response.text();
      
      // Check if the new toggle buttons are present
      if (html.includes('Paste from Google Sheets')) {
        console.log('✅ Google Sheets text area feature is deployed!');
      } else {
        console.log('❌ Google Sheets text area feature not found in HTML');
      }
      
      // Check if the text area is present
      if (html.includes('textarea')) {
        console.log('✅ Text area element found');
      } else {
        console.log('❌ Text area element not found');
      }
      
      // Check if the toggle buttons are present
      if (html.includes('Choose Import Method')) {
        console.log('✅ Import method toggle found');
      } else {
        console.log('❌ Import method toggle not found');
      }
      
    } else {
      console.log('❌ Import page not accessible:', response.status);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testImportPage();


