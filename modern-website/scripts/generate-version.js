#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate version info for build-time injection
const generateVersion = () => {
  const manifestVersion = '110'; // Base version
  const timestamp = Date.now().toString();
  
  // Get git commit hash if available
  let gitCommitSha = 'unknown';
  try {
    const { execSync } = require('child_process');
    gitCommitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim().substring(0, 7);
  } catch (error) {
    console.warn('Could not get git commit hash:', error.message);
  }
  
  // Create version strings
  const version = `v${manifestVersion}-${gitCommitSha}-${timestamp}`;
  const cleanVersion = `v${manifestVersion}`;
  
  const versionInfo = {
    version,
    cleanVersion,
    manifestVersion,
    gitCommitSha,
    buildTime: new Date().toISOString(),
    timestamp
  };
  
  console.log('Generated version info:', versionInfo);
  
  // Write version info to a JSON file for build-time access
  const versionFilePath = path.join(process.cwd(), 'src', 'lib', 'build-version.json');
  fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
  
  console.log(`Version info written to: ${versionFilePath}`);
  
  return versionInfo;
};

// Run the generation
if (require.main === module) {
  generateVersion();
}

module.exports = { generateVersion };
