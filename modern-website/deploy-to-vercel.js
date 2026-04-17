#!/usr/bin/env node

// Deploy to Vercel with proper configuration
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment process...');

try {
  // 1. Clean previous build
  console.log('🧹 Cleaning previous build...');
  try {
    execSync('rm -rf .next', { stdio: 'inherit' });
  } catch (e) {
    console.log('No .next directory to clean');
  }

  // 2. Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // 3. Generate version
  console.log('🏷️ Generating build version...');
  execSync('npm run generate-version', { stdio: 'inherit' });

  // 4. Build the application
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // 5. Verify build output
  const buildDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build failed - .next directory not created');
  }

  // 6. Check if API routes are in build
  const apiBuildDir = path.join(buildDir, 'server', 'app', 'api');
  if (!fs.existsSync(apiBuildDir)) {
    console.warn('⚠️ API build directory not found in expected location');
    
    // Check alternative location for Next.js 13+ app router
    const altApiDir = path.join(buildDir, 'server', 'pages', 'api');
    if (!fs.existsSync(altApiDir)) {
      console.warn('⚠️ API routes not found in build output');
    }
  }

  // 7. Deploy to Vercel
  console.log('🌐 Deploying to Vercel...');
  console.log('This will deploy to production environment');
  
  // Use Vercel CLI for deployment
  execSync('npx vercel --prod', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VERCEL_ORG_ID: process.env.VERCEL_ORG_ID,
      VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID
    }
  });

  console.log('✅ Deployment completed!');
  console.log('🔍 Testing deployed API...');

  // 8. Test the deployed API
  setTimeout(async () => {
    try {
      const https = require('https');
      
      const testAPI = () => {
        return new Promise((resolve, reject) => {
          const req = https.request({
            hostname: 'atarwebb.com',
            port: 443,
            path: '/api/auth/security-questions',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Deployment Test'
            },
            timeout: 10000
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              if (res.statusCode === 200) {
                console.log('✅ API deployment test PASSED');
                try {
                  const parsed = JSON.parse(data);
                  console.log(`✅ Found ${parsed.questions?.length || 0} security questions`);
                } catch (e) {
                  console.log('⚠️ API responded but with invalid JSON');
                }
              } else {
                console.log(`❌ API test failed with status: ${res.statusCode}`);
              }
              resolve();
            });
          });

          req.on('error', (e) => {
            console.log('❌ API test failed:', e.message);
            reject(e);
          });

          req.on('timeout', () => {
            req.destroy();
            console.log('❌ API test timed out');
            reject(new Error('timeout'));
          });

          req.end();
        });
      };

      await testAPI();
      
    } catch (error) {
      console.log('❌ API test error:', error.message);
    }
  }, 30000); // Wait 30 seconds for deployment to propagate

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
