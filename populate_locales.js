import fs from 'fs';
import path from 'path';

const localesDir = './beezee/src/i18n/locales';
const enPath = path.join(localesDir, 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const otherLocales = ['nr.json', 'nso.json', 'ss.json', 'st.json', 'tn.json', 'ts.json', 've.json', 'xh.json'];

otherLocales.forEach((file) => {
  const filePath = path.join(localesDir, file);
  let current;
  try {
    current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    current = {};
  }

  // Merge English keys into the current locale if they are missing
  const merged = { ...en, ...current };
  
  // Also ensure nested objects are merged
  Object.keys(en).forEach(key => {
    if (typeof en[key] === 'object' && en[key] !== null) {
      merged[key] = { ...en[key], ...(current[key] || {}) };
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Updated ${file}`);
});


