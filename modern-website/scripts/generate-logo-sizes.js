const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_LOGO = path.join(__dirname, '../public/beezee-logo.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

// Icon sizes to generate
const SIZES = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

async function generateLogos() {
  console.log('🐝 Starting Beezee logo generation...\n');

  // Check if source file exists
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Source logo not found at:', SOURCE_LOGO);
    console.error('Please ensure beezee-logo.png exists in the public directory');
    process.exit(1);
  }

  try {
    // Generate PNG icons for each size
    console.log('📐 Generating PNG icons...');
    for (const size of SIZES) {
      const outputPath = path.join(OUTPUT_DIR, `beezee-icon-${size}x${size}.png`);
      
      await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      
      console.log(`  ✅ Generated ${size}x${size} icon`);
    }

    // Generate favicon.ico (multi-resolution)
    console.log('\n🎯 Generating favicon.ico...');
    const faviconSizes = [16, 32, 48];
    const faviconBuffers = [];

    for (const size of faviconSizes) {
      const buffer = await sharp(SOURCE_LOGO)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      faviconBuffers.push(buffer);
    }

    // For favicon.ico, we'll use the 32x32 as the main icon with cover fit for larger appearance
    // (ICO format with multiple sizes requires additional library, using single size for simplicity)
    await sharp(SOURCE_LOGO)
      .resize(32, 32, {
        fit: 'cover',
        position: 'center',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(path.join(OUTPUT_DIR, 'favicon.ico'));

    console.log('  ✅ Generated favicon.ico');

    // Generate main beezee.png (512x512 for general use)
    console.log('\n📦 Generating main beezee.png...');
    await sharp(SOURCE_LOGO)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(OUTPUT_DIR, 'beezee.png'));
    
    console.log('  ✅ Generated beezee.png');

    console.log('\n✨ Logo generation complete!');
    console.log(`📊 Generated ${SIZES.length + 2} files total`);
    
  } catch (error) {
    console.error('\n❌ Error generating logos:', error.message);
    process.exit(1);
  }
}

// Run the script
generateLogos();
