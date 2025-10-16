// Test CSV parsing logic locally
const fs = require('fs');

function parseCSV(csvText) {
  console.log('Original CSV text:');
  console.log(JSON.stringify(csvText));
  console.log('---');
  
  // Clean up carriage returns and split by lines
  const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const leads = [];

  console.log('CSV Headers:', headers);
  console.log('CSV Lines count:', lines.length);

  // Parse CSV data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    // Parse CSV line handling quoted fields
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Add the last field
    
    console.log(`Parsing line ${i}:`, { line, values, headersLength: headers.length, valuesLength: values.length });
    
    if (values.length === headers.length) {
      const lead = {};
      headers.forEach((header, index) => {
        const value = values[index];
        switch (header.toLowerCase()) {
          case 'firstname':
            lead.firstName = value || '';
            break;
          case 'lastname':
            lead.lastName = value || '';
            break;
          case 'email':
            lead.email = value;
            break;
          case 'phone':
            lead.phone = value;
            break;
          case 'company':
            lead.company = value;
            break;
          case 'industry':
            lead.industry = value;
            break;
          case 'source':
            lead.source = value;
            break;
        }
      });
      
      console.log('Parsed lead:', lead);
      leads.push(lead);
    } else {
      console.log('Skipping line - length mismatch');
    }
  }
  
  return leads;
}

// Test with the same CSV we're using
const testCSV = `firstName,lastName,email,company,phone,source,industry
Debug,Test,debug.test@example.com,Debug Corp,555-9999,Website,Technology`;

console.log('Testing CSV parsing...');
const parsedLeads = parseCSV(testCSV);
console.log('\nFinal parsed leads:', parsedLeads);


