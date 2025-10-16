// Test the component structure locally
const fs = require('fs');

try {
  const componentContent = fs.readFileSync('src/components/FlexibleImport.tsx', 'utf8');
  
  console.log('Checking component structure...');
  
  // Check for the toggle buttons
  if (componentContent.includes('Paste from Google Sheets')) {
    console.log('✅ Toggle button text found');
  } else {
    console.log('❌ Toggle button text not found');
  }
  
  // Check for the text area
  if (componentContent.includes('textarea')) {
    console.log('✅ Textarea element found');
  } else {
    console.log('❌ Textarea element not found');
  }
  
  // Check for the conditional rendering
  if (componentContent.includes('importMode === \'text\'')) {
    console.log('✅ Conditional rendering found');
  } else {
    console.log('❌ Conditional rendering not found');
  }
  
  // Check for the state variables
  if (componentContent.includes('const [importMode, setImportMode]')) {
    console.log('✅ Import mode state found');
  } else {
    console.log('❌ Import mode state not found');
  }
  
  console.log('Component structure check complete.');
  
} catch (error) {
  console.error('Error reading component:', error);
}


