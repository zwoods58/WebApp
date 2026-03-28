#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Common Framer Motion patterns and their CSS replacements
const replacements = [
  // Remove imports
  {
    find: /import\s*{\s*motion\s*(?:,\s*AnimatePresence)?\s*}\s*from\s*['"]framer-motion['"];?\s*\n/g,
    replace: ''
  },
  // Remove standalone imports
  {
    find: /import\s*{\s*AnimatePresence\s*}\s*from\s*['"]framer-motion['"];?\s*\n/g,
    replace: ''
  },
  // Replace AnimatePresence with conditional rendering
  {
    find: /<AnimatePresence[^>]*>/g,
    replace: ''
  },
  {
    find: /<\/AnimatePresence>/g,
    replace: ''
  },
  // Replace motion.div with div + fade-in class
  {
    find: /<motion\.div[^>]*initial=\{\{\s*opacity:\s*0[^}]*\}\}[^>]*>/g,
    replace: '<div class="fade-in">'
  },
  // Replace motion.div with slide-in-up class
  {
    find: /<motion\.div[^>]*initial=\{\{\s*y:\s*['"]100%['"][^}]*\}\}[^>]*>/g,
    replace: '<div class="slide-in-up">'
  },
  // Replace motion.div with scale-in class
  {
    find: /<motion\.div[^>]*initial=\{\{\s*scale:\s*0\.\d[^}]*\}\}[^>]*>/g,
    replace: '<div class="scale-in">'
  },
  // Close motion.div tags
  {
    find: /<\/motion\.div>/g,
    replace: '</div>'
  },
  // Replace any remaining motion.div opening tags
  {
    find: /<motion\.div[^>]*>/g,
    replace: '<div>'
  },
  // Replace motion.button with button + button-tap class
  {
    find: /<motion\.button[^>]*whileHover[^>]*>/g,
    replace: '<button class="button-tap">'
  },
  {
    find: /<motion\.button[^>]*whileTap[^>]*>/g,
    replace: '<button class="button-tap">'
  },
  {
    find: /<motion\.button[^>]*>/g,
    replace: '<button class="button-tap">'
  },
  {
    find: /<\/motion\.button>/g,
    replace: '</button>'
  },
  // Remove animation props
  {
    find: /\s*initial=\{\{[^}]*\}\}\s*/g,
    replace: ''
  },
  {
    find: /\s*animate=\{\{[^}]*\}\}\s*/g,
    replace: ''
  },
  {
    find: /\s*exit=\{\{[^}]*\}\}\s*/g,
    replace: ''
  },
  {
    find: /\s*transition=\{\{[^}]*\}\}\s*/g,
    replace: ''
  }
];

function migrateFile(filePath) {
  console.log(`Migrating: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Apply all replacements
  replacements.forEach(({ find, replace }) => {
    content = content.replace(find, replace);
  });
  
  // Write back if changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

function findFilesToMigrate(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('framer-motion')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Main execution - Target BeeZee app and universal components
const beezeeDir = path.join(__dirname, 'src', 'app', 'Beezee-App');
const universalDir = path.join(__dirname, 'src', 'components', 'universal');
const authDir = path.join(__dirname, 'src', 'components', 'auth');
const signupDir = path.join(__dirname, 'src', 'components', 'signup');

const filesToMigrate = [
  ...findFilesToMigrate(beezeeDir),
  ...findFilesToMigrate(universalDir),
  ...findFilesToMigrate(authDir),
  ...findFilesToMigrate(signupDir)
];

console.log(`Found ${filesToMigrate.length} files to migrate:`);
filesToMigrate.forEach(file => console.log(`  - ${file}`));

let migratedCount = 0;
filesToMigrate.forEach(file => {
  if (migrateFile(file)) {
    migratedCount++;
  }
});

console.log(`\nMigration complete! Updated ${migratedCount} files.`);
