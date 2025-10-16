// Test CSV parsing logic directly
const testCSV = `firstName,lastName,email,company,phone,source,industry
Debug,Test,debug.test@example.com,Debug Corp,555-9999,Website,Technology`;

console.log('Testing CSV parsing logic...');
console.log('CSV content:');
console.log(testCSV);

// Simulate the parsing logic from the import route
const lines = testCSV.split('\n');
console.log('\nLines:', lines);

if (lines.length > 1) {
  const headers = lines[0].split(',').map(h => h.trim());
  console.log('Headers:', headers);
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.trim());
    console.log(`Line ${i} values:`, values);
    
    const leadData = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      switch (header.toLowerCase()) {
        case 'firstname':
          leadData.firstName = value || '';
          break;
        case 'lastname':
          leadData.lastName = value || '';
          break;
        case 'name':
          const nameParts = value.split(' ');
          leadData.firstName = nameParts[0] || '';
          leadData.lastName = nameParts.slice(1).join(' ') || '';
          break;
        case 'email':
          leadData.email = value;
          break;
        case 'phone':
          leadData.phone = value;
          break;
        case 'company':
          leadData.company = value;
          break;
        case 'industry':
          leadData.industry = value;
          break;
        case 'website':
          leadData.website = value;
          break;
        default:
          leadData[header.toLowerCase()] = value;
      }
    });
    
    console.log('Parsed lead data:', leadData);
    console.log('firstName:', leadData.firstName);
    console.log('lastName:', leadData.lastName);
    console.log('email:', leadData.email);
  }
}


