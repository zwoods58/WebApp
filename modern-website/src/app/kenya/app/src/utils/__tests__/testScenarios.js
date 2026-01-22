// Test Scenarios for Voice Transaction Recording
// Real-world examples from South African informal businesses

export const testScenarios = [
  // SCENARIO 1: Spaza Shop Owner
  {
    name: 'Spaza Shop - Airtime Sale',
    audio: 'Sold fifty rand airtime to a customer',
    expected: {
      amount: 50,
      type: 'income',
      category: 'Sales',
      description: 'Sold airtime',
      minConfidence: 0.8,
    },
  },
  {
    name: 'Spaza Shop - Stock Purchase',
    audio: 'Bought stock for two hundred rand at the wholesaler',
    expected: {
      amount: 200,
      type: 'expense',
      category: 'Stock',
      description: 'Bought stock',
      minConfidence: 0.8,
    },
  },

  // SCENARIO 2: Taxi Operator
  {
    name: 'Taxi - Daily Takings',
    audio: 'Made one thousand rand today from passengers',
    expected: {
      amount: 1000,
      type: 'income',
      category: 'Sales',
      minConfidence: 0.7,
    },
  },
  {
    name: 'Taxi - Fuel Purchase',
    audio: 'Paid 500 rand for petrol',
    expected: {
      amount: 500,
      type: 'expense',
      category: 'Transport',
      minConfidence: 0.8,
    },
  },

  // SCENARIO 3: Street Vendor
  {
    name: 'Street Vendor - Daily Sales',
    audio: 'Sold vegetables for R350 today',
    expected: {
      amount: 350,
      type: 'income',
      category: 'Sales',
      minConfidence: 0.8,
    },
  },
  {
    name: 'Street Vendor - Transport to Market',
    audio: 'Taxi fare to market, thirty rand',
    expected: {
      amount: 30,
      type: 'expense',
      category: 'Transport',
      minConfidence: 0.8,
    },
  },

  // SCENARIO 4: Hair Salon
  {
    name: 'Salon - Service Payment',
    audio: 'Customer paid 150 for braids',
    expected: {
      amount: 150,
      type: 'income',
      category: 'Sales',
      minConfidence: 0.8,
    },
  },
  {
    name: 'Salon - Electricity',
    audio: 'Bought prepaid electricity, R200',
    expected: {
      amount: 200,
      type: 'expense',
      category: 'Electricity',
      minConfidence: 0.8,
    },
  },

  // SCENARIO 5: Different Accents & Pronunciations
  {
    name: 'South African Accent - R pronunciation',
    audio: 'Received payment of ah hundred rand',
    expected: {
      amount: 100,
      type: 'income',
      minConfidence: 0.6,
    },
  },

  // SCENARIO 6: Short & Quick Entries
  {
    name: 'Quick Entry - Airtime',
    audio: 'Airtime fifty',
    expected: {
      amount: 50,
      category: 'Airtime',
      minConfidence: 0.6,
    },
  },
  {
    name: 'Quick Entry - Taxi',
    audio: 'Taxi thirty rand',
    expected: {
      amount: 30,
      type: 'expense',
      category: 'Transport',
      minConfidence: 0.7,
    },
  },

  // SCENARIO 7: Common Expenses
  {
    name: 'Common Expense - Rent',
    audio: 'Paid rent for the month, one thousand five hundred',
    expected: {
      amount: 1500,
      type: 'expense',
      category: 'Rent',
      minConfidence: 0.8,
    },
  },
  {
    name: 'Common Expense - Food',
    audio: 'Bought lunch for 50 rand',
    expected: {
      amount: 50,
      type: 'expense',
      category: 'Food',
      minConfidence: 0.8,
    },
  },

  // SCENARIO 8: Background Noise (Lower Confidence Expected)
  {
    name: 'With Background Noise',
    audio: '[background noise] sold... [unclear] ...hundred rand...',
    expected: {
      type: 'income',
      minConfidence: 0.0,
      maxConfidence: 0.6,
    },
  },

  // SCENARIO 9: Unclear/Ambiguous
  {
    name: 'Unclear Transaction',
    audio: 'um... I think it was... maybe hundred... or something',
    expected: {
      minConfidence: 0.0,
      maxConfidence: 0.5,
    },
  },

  // SCENARIO 10: Mixed English/Afrikaans Numbers
  {
    name: 'Mixed Language - Amount',
    audio: 'Sold goods for vyftig rand', // "vyftig" = fifty in Afrikaans
    expected: {
      amount: 50,
      type: 'income',
      minConfidence: 0.6,
    },
  },
];

export const errorScenarios = [
  {
    name: 'No Audio',
    audio: null,
    expectedError: 'Missing audio data',
  },
  {
    name: 'Silent Audio',
    audio: '[complete silence]',
    expectedError: 'Audio too quiet',
  },
  {
    name: 'Gibberish',
    audio: 'blah blah blah random words',
    expected: {
      confidence: 0.3,
    },
  },
];

// Test data for offline queue testing
export const offlineQueueTests = [
  {
    scenario: 'Save multiple recordings offline',
    recordings: [
      { audio: 'sold 50 rand airtime', timestamp: Date.now() },
      { audio: 'bought stock for 200', timestamp: Date.now() + 1000 },
      { audio: 'taxi fare 30 rand', timestamp: Date.now() + 2000 },
    ],
    expectedQueueSize: 3,
  },
  {
    scenario: 'Process queue when online',
    recordings: [
      { audio: 'sold 100 rand', status: 'pending' },
    ],
    expectedProcessed: 1,
  },
];

// Performance benchmarks
export const performanceBenchmarks = {
  maxRecordingTime: 10, // seconds
  maxProcessingTime: 5, // seconds
  maxAudioSize: 5 * 1024 * 1024, // 5MB
  targetCompressedSize: 500 * 1024, // 500KB
  minConfidenceThreshold: 0.5,
  recommendedConfidenceThreshold: 0.7,
};

// Accessibility requirements
export const accessibilityRequirements = {
  minButtonSize: 80, // px
  minTouchTargetSize: 48, // px
  minContrastRatio: 4.5,
  maxLabelLength: 50, // characters
  requiresVibrationFeedback: true,
  requiresVisualFeedback: true,
  requiresAudioFeedback: false,
};

// User experience metrics
export const uxMetrics = {
  maxTimeToRecord: 1, // seconds (time to start recording after button press)
  maxTimeToConfirm: 3, // seconds (time to show confirmation screen)
  minFeedbackFrequency: 1, // updates per second during recording
  maxRetryAttempts: 3,
  autoSaveThreshold: 0.8, // confidence level for auto-save
};

export default {
  testScenarios,
  errorScenarios,
  offlineQueueTests,
  performanceBenchmarks,
  accessibilityRequirements,
  uxMetrics,
};


