// Test if the component can be imported
const fs = require('fs');

try {
  console.log('Testing component import...');
  
  // Check if the file exists
  if (fs.existsSync('src/components/FlexibleImport.tsx')) {
    console.log('✅ FlexibleImport.tsx file exists');
    
    const content = fs.readFileSync('src/components/FlexibleImport.tsx', 'utf8');
    
    // Check for export
    if (content.includes('export default function FlexibleImport')) {
      console.log('✅ Component has default export');
    } else {
      console.log('❌ Component missing default export');
    }
    
    // Check for syntax issues
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    console.log('Braces count - Open:', openBraces, 'Close:', closeBraces);
    
    if (openBraces === closeBraces) {
      console.log('✅ Braces are balanced');
    } else {
      console.log('❌ Braces are not balanced - syntax error!');
    }
    
    // Check for the new features
    if (content.includes('importMode')) {
      console.log('✅ importMode state found');
    } else {
      console.log('❌ importMode state not found');
    }
    
    if (content.includes('Paste from Google Sheets')) {
      console.log('✅ Google Sheets button text found');
    } else {
      console.log('❌ Google Sheets button text not found');
    }
    
  } else {
    console.log('❌ FlexibleImport.tsx file does not exist');
  }
  
} catch (error) {
  console.error('Error testing component:', error);
}


