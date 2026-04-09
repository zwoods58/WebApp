// Main translations loader - combines all industry-specific translation files
// This file replaces the monolithic translations-new.js while maintaining the same structure

import universal from './universal.js';
import retail from './retail.js';
import tailor from './tailor.js';
import transport from './transport.js';
import food from './food.js';
import repairs from './repairs.js';
import salon from './salon.js';
import freelance from './freelance.js';

// Combine all industry translations into the same structure as the original file
const translations = {
  universal,
  retail,
  tailor,
  transport,
  food,
  repairs,
  salon,
  freelance
};

export default translations;
