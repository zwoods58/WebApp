/**
 * Optimized Icon Generator for BeeZee PWA
 * Creates icons with better logo fitment and proper padding
 */

// Canvas-based icon generator
function generateOptimizedIcon(size, isMaskable = false) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = size;
    canvas.height = size;
    
    // Draw background
    ctx.fillStyle = '#000000';
    
    // Calculate padding and logo size based on icon type
    const padding = isMaskable ? size * 0.15 : size * 0.2; // 15% for maskable, 20% for standard
    const logoSize = isMaskable ? size * 0.7 : size * 0.6; // 70% for maskable, 60% for standard
    const borderRadius = size * 0.2; // 20% border radius
    
    // Draw rounded background
    ctx.beginPath();
    ctx.moveTo(borderRadius, 0);
    ctx.lineTo(size - borderRadius, 0);
    ctx.quadraticCurveTo(size, 0, size, borderRadius);
    ctx.lineTo(size, size - borderRadius);
    ctx.quadraticCurveTo(size, size, size - borderRadius, size);
    ctx.lineTo(borderRadius, size);
    ctx.quadraticCurveTo(0, size, 0, size - borderRadius);
    ctx.lineTo(0, borderRadius);
    ctx.quadraticCurveTo(0, 0, borderRadius, 0);
    ctx.closePath();
    ctx.fill();
    
    // Load and draw the logo
    const img = new Image();
    img.onload = function() {
        // Draw the logo centered with proper scaling
        ctx.drawImage(img, padding, padding, logoSize, logoSize);
        
        // Convert to blob and download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `beezee-icon-${size}x${size}${isMaskable ? '-maskable' : ''}-optimized.png`;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    };
    
    img.src = 'beezee-icon-512x512.png'; // Load the original icon
}

// Generate all required sizes
function generateAllOptimizedIcons() {
    const sizes = [
        { size: 72, maskable: false },
        { size: 96, maskable: false },
        { size: 128, maskable: false },
        { size: 144, maskable: false },
        { size: 152, maskable: false },
        { size: 192, maskable: true },  // Maskable for Android
        { size: 384, maskable: false },
        { size: 512, maskable: true }   // Maskable for desktop
    ];
    
    console.log('🎨 Generating optimized BeeZee icons...');
    
    sizes.forEach(({ size, maskable }) => {
        setTimeout(() => {
            generateOptimizedIcon(size, maskable);
            console.log(`✅ Generated ${size}x${size} ${maskable ? 'maskable' : 'standard'} icon`);
        }, sizes.indexOf({ size, maskable }) * 500); // Stagger generation
    });
}

// Alternative: Create a server-side Node.js version
function createOptimizedIconServer(size, isMaskable = false) {
    const fs = require('fs');
    const sharp = require('sharp');
    
    const padding = isMaskable ? Math.floor(size * 0.15) : Math.floor(size * 0.2);
    const logoSize = isMaskable ? Math.floor(size * 0.7) : Math.floor(size * 0.6);
    const borderRadius = Math.floor(size * 0.2);
    
    // Create a canvas with rounded corners
    return sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
        }
    })
    .composite([{
        input: Buffer.from(`
            <svg width="${size}" height="${size}">
                <rect width="${size}" height="${size}" rx="${borderRadius}" fill="#000000"/>
            </svg>
        `),
        left: 0,
        top: 0
    }])
    .composite([{
        input: 'beezee-icon-512x512.png',
        left: padding,
        top: padding,
        blend: 'over'
    }])
    .resize(logoSize, logoSize, {
        fit: 'contain',
        position: 'center'
    })
    .png()
    .toFile(`beezee-icon-${size}x${size}${isMaskable ? '-maskable' : ''}-optimized.png`);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateOptimizedIcon, createOptimizedIconServer, generateAllOptimizedIcons };
}

// Auto-run in browser
if (typeof window !== 'undefined') {
    window.generateOptimizedIcons = generateAllOptimizedIcons;
    console.log('📱 Icon generator loaded! Run generateOptimizedIcons() to create all optimized icons.');
}
