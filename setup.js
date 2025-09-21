#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up WebApp Solutions Client Portal...\n');

// Check if Node.js is installed
const nodeVersion = process.version;
console.log(`✅ Node.js version: ${nodeVersion}`);

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Check if .env.local exists
if (!fs.existsSync('.env.local')) {
  console.log('📝 Creating .env.local from template...');
  try {
    const envExample = fs.readFileSync('env.example', 'utf8');
    fs.writeFileSync('.env.local', envExample);
    console.log('✅ .env.local created successfully');
    console.log('⚠️  Please update .env.local with your actual environment variables');
  } catch (error) {
    console.error('❌ Error creating .env.local:', error.message);
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  console.log('Please run: npm install');
} else {
  console.log('✅ Dependencies already installed');
}

console.log('\n🎉 Setup complete! Next steps:');
console.log('1. Update .env.local with your Supabase and Stripe credentials');
console.log('2. Run: npm install');
console.log('3. Set up your Supabase database using src/lib/database.sql');
console.log('4. Run: npm run dev');
console.log('5. Open http://localhost:3000 in your browser');
console.log('\n📚 For detailed instructions, see README.md');
