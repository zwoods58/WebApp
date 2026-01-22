/**
 * Comprehensive Test Suite for BeeZee Finance PWAs
 * Tests all critical functionality across Kenya, South Africa, and Nigeria
 */

export class TestSuite {
  constructor() {
    this.testResults = [];
    this.currentCountry = 'kenya';
    this.testTimeout = 10000; // 10 seconds per test
  }

  /**
   * Run complete test suite
   */
  async runFullTestSuite(country = 'kenya') {
    this.currentCountry = country;
    this.testResults = [];
    
    console.log(`🧪 Starting Test Suite for ${country.toUpperCase()} PWA`);
    
    const testCategories = [
      { name: 'Core Functionality', tests: this.getCoreTests() },
      { name: 'Localization', tests: this.getLocalizationTests() },
      { name: 'Security', tests: this.getSecurityTests() },
      { name: 'Transactions', tests: this.getTransactionTests() },
      { name: 'Inventory', tests: this.getInventoryTests() },
      { name: 'Reports', tests: this.getReportTests() },
      { name: 'Coaching', tests: this.getCoachingTests() },
      { name: 'Settings', tests: this.getSettingsTests() },
      { name: 'Offline', tests: this.getOfflineTests() },
      { name: 'Performance', tests: this.getPerformanceTests() }
    ];

    for (const category of testCategories) {
      console.log(`\n📋 Testing ${category.name}...`);
      
      for (const test of category.tests) {
        const result = await this.runTest(test);
        this.testResults.push(result);
        
        if (result.status === 'failed') {
          console.error(`❌ ${test.name}: ${result.error}`);
        } else {
          console.log(`✅ ${test.name}: ${result.duration}ms`);
        }
      }
    }

    const summary = this.generateTestSummary();
    console.log('\n📊 Test Suite Summary:', summary);
    
    return summary;
  }

  /**
   * Run individual test
   */
  async runTest(test) {
    const startTime = Date.now();
    
    try {
      const result = await Promise.race([
        test.test(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), this.testTimeout)
        )
      ]);
      
      return {
        name: test.name,
        category: test.category,
        status: 'passed',
        duration: Date.now() - startTime,
        result
      };
    } catch (error) {
      return {
        name: test.name,
        category: test.category,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Core functionality tests
   */
  getCoreTests() {
    return [
      {
        name: 'App Initialization',
        category: 'Core',
        test: async () => {
          // Test if app initializes properly
          const appElement = document.getElementById('root');
          if (!appElement) throw new Error('Root element not found');
          
          // Check if critical scripts loaded
          if (typeof React === 'undefined') throw new Error('React not loaded');
          
          return { initialized: true };
        }
      },
      {
        name: 'Service Worker Registration',
        category: 'Core',
        test: async () => {
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (!registration.active) throw new Error('Service worker not active');
            return { registered: true, scope: registration.scope };
          } else {
            throw new Error('Service workers not supported');
          }
        }
      },
      {
        name: 'PWA Manifest',
        category: 'Core',
        test: async () => {
          const manifest = await fetch('/manifest.json').then(r => r.json());
          if (!manifest.name) throw new Error('Manifest missing name');
          if (!manifest.icons || manifest.icons.length === 0) throw new Error('Manifest missing icons');
          return { manifest: true, icons: manifest.icons.length };
        }
      },
      {
        name: 'Database Connection',
        category: 'Core',
        test: async () => {
          // Test Supabase connection
          const { supabase } = await import('./supabase');
          const { data, error } = await supabase.from('test_connection').select('count').single();
          
          if (error && error.code !== 'PGRST116') {
            throw new Error(`Database error: ${error.message}`);
          }
          
          return { connected: true };
        }
      }
    ];
  }

  /**
   * Localization tests
   */
  getLocalizationTests() {
    return [
      {
        name: 'Currency Formatting',
        category: 'Localization',
        test: async () => {
          const { formatCurrency, getCurrentCountry } = await import('./currency');
          const country = getCurrentCountry();
          
          const testAmount = 1000;
          const formatted = formatCurrency(testAmount);
          
          if (!formatted) throw new Error('Currency formatting failed');
          
          // Test country-specific formatting
          const expectedSymbols = {
            kenya: 'KES',
            'south-africa': 'R',
            nigeria: '₦'
          };
          
          if (!formatted.includes(expectedSymbols[this.currentCountry])) {
            throw new Error(`Expected ${expectedSymbols[this.currentCountry]} symbol`);
          }
          
          return { formatted, country: country.code };
        }
      },
      {
        name: 'Date/Time Formatting',
        category: 'Localization',
        test: async () => {
          const { formatDate, getCurrentCountry } = await import('./dateTime');
          const country = getCurrentCountry();
          
          const testDate = new Date();
          const formatted = formatDate(testDate);
          
          if (!formatted) throw new Error('Date formatting failed');
          
          return { formatted, country: country.code };
        }
      },
      {
        name: 'Language Switching',
        category: 'Localization',
        test: async () => {
          const { i18n } = await import('../i18n');
          
          const originalLang = i18n.language;
          
          // Test language change
          await i18n.changeLanguage('en');
          if (i18n.language !== 'en') throw new Error('Language change failed');
          
          // Restore original language
          await i18n.changeLanguage(originalLang);
          
          return { currentLang: i18n.language };
        }
      }
    ];
  }

  /**
   * Security tests
   */
  getSecurityTests() {
    return [
      {
        name: 'PIN Vault Creation',
        category: 'Security',
        test: async () => {
          const { pinVault } = await import('./pinVault');
          
          const testSecret = 'test-secret-key';
          const testPin = '1234';
          
          const result = pinVault.encryptSecret(testSecret, testPin);
          if (!result.success) throw new Error('PIN encryption failed');
          
          const decryptResult = pinVault.decryptSecret(testPin);
          if (!decryptResult.success) throw new Error('PIN decryption failed');
          
          if (decryptResult.secretKey !== testSecret) {
            throw new Error('Decrypted secret mismatch');
          }
          
          return { encrypted: true, decrypted: true };
        }
      },
      {
        name: 'Recovery Phrase Generation',
        category: 'Security',
        test: async () => {
          const { recoveryPhrase } = await import('./recoveryPhrase');
          
          const result = recoveryPhrase.generatePhrase();
          if (!result.success) throw new Error('Recovery phrase generation failed');
          
          if (!result.phrase || result.words.length !== 12) {
            throw new Error('Invalid recovery phrase format');
          }
          
          const validation = recoveryPhrase.validatePhrase(result.phrase);
          if (!validation.valid) throw new Error('Recovery phrase validation failed');
          
          return { phrase: result.phrase, words: result.words.length };
        }
      },
      {
        name: 'Browser Compatibility',
        category: 'Security',
        test: async () => {
          const { pinVault } = await import('./pinVault');
          
          const compatibility = pinVault.detectBrowserSupport();
          
          if (!compatibility.supported) {
            console.warn('Browser compatibility warning:', compatibility.message);
          }
          
          return { supported: compatibility.supported, browser: compatibility.browser };
        }
      }
    ];
  }

  /**
   * Transaction tests
   */
  getTransactionTests() {
    return [
      {
        name: 'Transaction Creation',
        category: 'Transactions',
        test: async () => {
          const { transactionManager } = await import('./transactionManager');
          
          const testTransaction = {
            type: 'income',
            amount: '1000',
            category: 'Sales',
            description: 'Test transaction',
            paymentMethod: 'Cash'
          };
          
          const result = await transactionManager.createTransaction('test-user', testTransaction);
          
          if (!result.success) throw new Error('Transaction creation failed');
          
          return { transactionId: result.transaction.id, amount: result.transaction.amount };
        }
      },
      {
        name: 'Transaction Filtering',
        category: 'Transactions',
        test: async () => {
          const { transactionManager } = await import('./transactionManager');
          
          const filters = {
            type: 'income',
            dateRange: 'thisMonth'
          };
          
          const result = await transactionManager.getTransactions('test-user', filters);
          
          if (!result.success) throw new Error('Transaction filtering failed');
          
          return { transactions: result.transactions.length, filters: result.filters };
        }
      },
      {
        name: 'Transaction Export',
        category: 'Transactions',
        test: async () => {
          const { transactionManager } = await import('./transactionManager');
          
          // Mock CSV export
          const result = await transactionManager.exportToCSV('test-user', {});
          
          if (!result.success) throw new Error('Transaction export failed');
          
          return { filename: result.filename };
        }
      }
    ];
  }

  /**
   * Inventory tests
   */
  getInventoryTests() {
    return [
      {
        name: 'Product Creation',
        category: 'Inventory',
        test: async () => {
          const { inventoryManager } = await import('./inventoryManager');
          
          const testProduct = {
            name: 'Test Product',
            category: 'Electronics',
            price: '5000',
            quantity: 10,
            minStockLevel: 5
          };
          
          const result = await inventoryManager.createProduct('test-user', testProduct);
          
          if (!result.success) throw new Error('Product creation failed');
          
          return { productId: result.product.id, stockStatus: result.product.stockStatus };
        }
      },
      {
        name: 'Stock Level Management',
        category: 'Inventory',
        test: async () => {
          const { inventoryManager } = await import('./inventoryManager');
          
          // Test stock update
          const result = await inventoryManager.updateStock('test-product-id', 5, 'add');
          
          if (!result.success) throw new Error('Stock update failed');
          
          return { newQuantity: result.product.quantity };
        }
      },
      {
        name: 'Low Stock Alerts',
        category: 'Inventory',
        test: async () => {
          const { inventoryManager } = await import('./inventoryManager');
          
          const result = await inventoryManager.getLowStockAlerts('test-user');
          
          if (!result.success) throw new Error('Low stock alerts failed');
          
          return { alerts: result.alerts.length };
        }
      }
    ];
  }

  /**
   * Report tests
   */
  getReportTests() {
    return [
      {
        name: 'Financial Report Generation',
        category: 'Reports',
        test: async () => {
          const { reportsManager } = await import('./reportsManager');
          
          const options = {
            period: 'thisMonth'
          };
          
          const result = await reportsManager.generateFinancialReport('test-user', options);
          
          if (!result.success) throw new Error('Report generation failed');
          
          return { 
            period: result.report.period,
            totalRevenue: result.report.summary.totalRevenue 
          };
        }
      },
      {
        name: 'Report Export to PDF',
        category: 'Reports',
        test: async () => {
          const { reportsManager } = await import('./reportsManager');
          
          const mockReport = {
            period: 'thisMonth',
            summary: { totalRevenue: 10000, totalExpenses: 5000 },
            revenueBreakdown: {},
            expenseBreakdown: {}
          };
          
          const result = await reportsManager.exportToPDF(mockReport);
          
          if (!result.success) throw new Error('PDF export failed');
          
          return { filename: result.filename };
        }
      }
    ];
  }

  /**
   * Coaching tests
   */
  getCoachingTests() {
    return [
      {
        name: 'Coaching Response Generation',
        category: 'Coaching',
        test: async () => {
          const coachingModule = this.currentCountry === 'kenya' 
            ? await import('./kenyaCoaching')
            : await import('./nigeriaCoaching');
          
          const { coachingSystem } = coachingModule;
          
          const query = 'How do I register my business?';
          const result = await coachingSystem.getCoachingResponse(query);
          
          if (!result.success) throw new Error('Coaching response failed');
          
          return { topic: result.topic, priority: result.priority };
        }
      },
      {
        name: 'Topic Analysis',
        category: 'Coaching',
        test: async () => {
          const coachingModule = this.currentCountry === 'kenya' 
            ? await import('./kenyaCoaching')
            : await import('./nigeriaCoaching');
          
          const { coachingSystem } = coachingModule;
          
          const topics = coachingSystem.getAvailableTopics();
          
          if (!topics || topics.length === 0) throw new Error('No topics available');
          
          return { topics: topics.length };
        }
      }
    ];
  }

  /**
   * Settings tests
   */
  getSettingsTests() {
    return [
      {
        name: 'Settings Management',
        category: 'Settings',
        test: async () => {
          const { settingsManager } = await import('./settingsManager');
          
          const testSettings = {
            language: 'en',
            theme: 'light',
            notifications: {
              email: true,
              push: true
            }
          };
          
          const result = await settingsManager.updateUserSettings('test-user', testSettings);
          
          if (!result.success) throw new Error('Settings update failed');
          
          return { settings: Object.keys(result.settings).length };
        }
      },
      {
        name: 'Settings Validation',
        category: 'Settings',
        test: async () => {
          const { settingsManager } = await import('./settingsManager');
          
          const invalidSettings = {
            language: 'invalid-lang',
            theme: 'invalid-theme'
          };
          
          const result = await settingsManager.updateUserSettings('test-user', invalidSettings);
          
          if (result.success) throw new Error('Invalid settings should fail');
          
          return { validation: 'passed' };
        }
      }
    ];
  }

  /**
   * Offline tests
   */
  getOfflineTests() {
    return [
      {
        name: 'Offline Storage',
        category: 'Offline',
        test: async () => {
          const { offlineManager } = await import('./offlineManager');
          
          const testTransaction = {
            id: 'test-123',
            type: 'income',
            amount: 1000,
            synced: false
          };
          
          const result = await offlineManager.saveTransaction(testTransaction);
          
          if (!result.success) throw new Error('Offline storage failed');
          
          return { stored: true, offline: result.offline };
        }
      },
      {
        name: 'Sync Queue',
        category: 'Offline',
        test: async () => {
          const { offlineManager } = await import('./offlineManager');
          
          const status = await offlineManager.getSyncStatus();
          
          return { 
            isOnline: status.isOnline,
            pendingSync: status.pendingSync
          };
        }
      },
      {
        name: 'Storage Usage',
        category: 'Offline',
        test: async () => {
          const { offlineManager } = await import('./offlineManager');
          
          const usage = await offlineManager.getStorageUsage();
          
          return { 
            quota: usage?.quota,
            usage: usage?.usage
          };
        }
      }
    ];
  }

  /**
   * Performance tests
   */
  getPerformanceTests() {
    return [
      {
        name: 'App Load Time',
        category: 'Performance',
        test: async () => {
          const navigation = performance.getEntriesByType('navigation')[0];
          
          if (!navigation) throw new Error('Navigation timing not available');
          
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          
          return { loadTime: Math.round(loadTime) };
        }
      },
      {
        name: 'Memory Usage',
        category: 'Performance',
        test: async () => {
          if ('memory' in performance) {
            const memory = performance.memory;
            
            return {
              used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
              total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
              limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
            };
          } else {
            return { message: 'Memory API not available' };
          }
        }
      },
      {
        name: 'Cache Performance',
        category: 'Performance',
        test: async () => {
          const startTime = Date.now();
          
          // Test cache access
          const cache = await caches.open('beezee-static-v1.0.0');
          const keys = await cache.keys();
          
          const duration = Date.now() - startTime;
          
          return { cachedItems: keys.length, accessTime: duration };
        }
      }
    ];
  }

  /**
   * Generate test summary
   */
  generateTestSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.status === 'passed').length;
    const failed = this.testResults.filter(r => r.status === 'failed').length;
    const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    const categories = {};
    this.testResults.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { total: 0, passed: 0, failed: 0 };
      }
      categories[result.category].total++;
      if (result.status === 'passed') {
        categories[result.category].passed++;
      } else {
        categories[result.category].failed++;
      }
    });
    
    const avgDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0) / total;
    
    return {
      country: this.currentCountry,
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed,
        failed,
        passRate: parseFloat(passRate),
        avgDuration: Math.round(avgDuration)
      },
      categories,
      failures: this.testResults.filter(r => r.status === 'failed').map(r => ({
        name: r.name,
        category: r.category,
        error: r.error
      }))
    };
  }

  /**
   * Export test results
   */
  exportTestResults() {
    const summary = this.generateTestSummary();
    
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `beezee_test_results_${this.currentCountry}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Run quick health check
   */
  async runQuickHealthCheck() {
    const criticalTests = [
      this.getCoreTests()[0], // App Initialization
      this.getCoreTests()[1], // Service Worker
      this.getLocalizationTests()[0], // Currency Formatting
      this.getSecurityTests()[0], // PIN Vault
      this.getOfflineTests()[0] // Offline Storage
    ];
    
    console.log('🏥 Running Quick Health Check...');
    
    for (const test of criticalTests) {
      const result = await this.runTest(test);
      
      if (result.status === 'failed') {
        console.error(`❌ Critical test failed: ${test.name}`);
        return { healthy: false, failed: test.name };
      }
    }
    
    console.log('✅ All critical tests passed');
    return { healthy: true };
  }
}

// Create singleton instance
export const testSuite = new TestSuite();
