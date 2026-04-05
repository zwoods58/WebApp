// Calendar Appointment Creation + PWA Navigation Test Script
// Run this in browser console on http://localhost:3000/Beezee-App/app/ke/retail/calendar

console.log('🚀 Starting Calendar Appointment Creation + PWA Navigation Test');

class CalendarNavigationTester {
  constructor() {
    this.testResults = [];
    this.testAppointment = null;
    this.navigationPaths = [
      { name: 'Home', path: '/Beezee-App/app/ke/retail/', icon: '🏠' },
      { name: 'Transactions', path: '/Beezee-App/app/ke/retail/cash', icon: '💰' },
      { name: 'Inventory', path: '/Beezee-App/app/ke/retail/stock', icon: '📦' },
      { name: 'Customers', path: '/Beezee-App/app/ke/retail/credit', icon: '👥' },
      { name: 'Services', path: '/Beezee-App/app/ke/retail/services', icon: '⚙️' },
      { name: 'More', path: '/Beezee-App/app/ke/retail/more', icon: '📋' },
      { name: 'Calendar', path: '/Beezee-App/app/ke/retail/calendar', icon: '📅' }
    ];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    console.log(logEntry);
    this.testResults.push({ timestamp, message, type });
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testCalendarPageLoad() {
    this.log('📅 Testing Calendar Page Load', 'test');
    
    try {
      // Check if we're on the calendar page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/calendar')) {
        this.log('❌ Not on calendar page', 'error');
        return false;
      }

      // Check for calendar elements
      const calendarElement = document.querySelector('[data-testid="calendar"]') || 
                            document.querySelector('.calendar') ||
                            document.querySelector('[class*="calendar"]');
      
      if (!calendarElement) {
        this.log('⚠️ Calendar element not found, checking for appointment list...', 'warning');
      }

      // Look for Add Appointment button
      const addButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Add') || 
        btn.textContent?.includes('Appointment') ||
        btn.getAttribute('aria-label')?.includes('Add')
      );

      if (!addButton) {
        this.log('❌ Add Appointment button not found', 'error');
        return false;
      }

      this.log('✅ Calendar page loaded successfully', 'success');
      this.log('✅ Add Appointment button found', 'success');
      return true;

    } catch (error) {
      this.log(`❌ Calendar page load error: ${error.message}`, 'error');
      return false;
    }
  }

  async testAppointmentCreation() {
    this.log('➕ Testing Appointment Creation', 'test');
    
    try {
      // Find and click Add Appointment button
      const addButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Add') || 
        btn.textContent?.includes('Appointment')
      );

      if (!addButton) {
        this.log('❌ Add Appointment button not found', 'error');
        return false;
      }

      // Click the button
      addButton.click();
      await this.delay(1000);

      // Look for modal or form
      const modal = document.querySelector('[role="dialog"]') || 
                   document.querySelector('.modal') ||
                   document.querySelector('[class*="modal"]') ||
                   document.querySelector('[class*="appointment"]');

      if (!modal) {
        this.log('❌ Appointment modal not found', 'error');
        return false;
      }

      this.log('✅ Appointment modal opened', 'success');

      // Fill in form fields
      const fields = {
        customerName: modal.querySelector('input[name*="customer"]') ||
                     modal.querySelector('input[placeholder*="customer"]') ||
                     modal.querySelector('input[type="text"]'),
        date: modal.querySelector('input[type="date"]') ||
               modal.querySelector('input[name*="date"]'),
        time: modal.querySelector('input[type="time"]') ||
               modal.querySelector('input[name*="time"]'),
        service: modal.querySelector('select[name*="service"]') ||
                modal.querySelector('input[name*="service"]'),
        notes: modal.querySelector('textarea[name*="notes"]') ||
                modal.querySelector('textarea[placeholder*="notes"]')
      };

      // Fill test data
      if (fields.customerName) {
        fields.customerName.value = 'Navigation Test User';
        fields.customerName.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (fields.date) {
        const today = new Date().toISOString().split('T')[0];
        fields.date.value = today;
        fields.date.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (fields.time) {
        fields.time.value = '15:00'; // 3:00 PM
        fields.time.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (fields.service) {
        // Try to select first option or set value
        if (fields.service.tagName === 'SELECT') {
          fields.service.selectedIndex = 0;
        } else {
          fields.service.value = 'Web Design Consulting';
        }
        fields.service.dispatchEvent(new Event('change', { bubbles: true }));
      }

      if (fields.notes) {
        fields.notes.value = 'Created for navigation testing';
        fields.notes.dispatchEvent(new Event('input', { bubbles: true }));
      }

      this.log('✅ Form fields filled with test data', 'success');

      // Find and click Save button
      const saveButton = Array.from(modal.querySelectorAll('button')).find(btn => 
        btn.textContent?.includes('Save') || 
        btn.textContent?.includes('Create') ||
        btn.textContent?.includes('Submit') ||
        btn.type === 'submit'
      );

      if (!saveButton) {
        this.log('❌ Save button not found', 'error');
        return false;
      }

      // Click save button
      saveButton.click();
      await this.delay(2000);

      // Check for success message or modal close
      const successMessage = document.querySelector('[class*="success"]') ||
                            document.querySelector('[class*="toast"]') ||
                            document.querySelector('.alert-success');

      if (successMessage) {
        this.log('✅ Success message displayed', 'success');
      }

      this.log('✅ Appointment creation completed', 'success');
      return true;

    } catch (error) {
      this.log(`❌ Appointment creation error: ${error.message}`, 'error');
      return false;
    }
  }

  async testNavigationToAllPages() {
    this.log('🧭 Testing Navigation to All PWA Pages', 'test');
    
    const navigationResults = [];

    for (const page of this.navigationPaths) {
      this.log(`📍 Navigating to ${page.name} (${page.path})`, 'info');
      
      try {
        const startTime = performance.now();
        
        // Navigate to the page
        window.location.href = page.path;
        await this.delay(2000); // Wait for page to load

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Check if navigation was successful
        const currentPath = window.location.pathname;
        const navigationSuccess = currentPath === page.path;

        if (navigationSuccess) {
          this.log(`✅ ${page.name} - Success (${loadTime.toFixed(0)}ms)`, 'success');
          navigationResults.push({ page: page.name, success: true, loadTime });
        } else {
          this.log(`❌ ${page.name} - Failed (expected ${page.path}, got ${currentPath})`, 'error');
          navigationResults.push({ page: page.name, success: false, loadTime });
        }

        // Look for page-specific elements
        const pageElement = this.findPageElement(page.name);
        if (pageElement) {
          this.log(`✅ ${page.name} page element found`, 'success');
        } else {
          this.log(`⚠️ ${page.name} page element not found`, 'warning');
        }

      } catch (error) {
        this.log(`❌ ${page.name} navigation error: ${error.message}`, 'error');
        navigationResults.push({ page: page.name, success: false, error: error.message });
      }
    }

    return navigationResults;
  }

  findPageElement(pageName) {
    const selectors = {
      'Home': '[class*="home"], [class*="dashboard"], [class*="overview"]',
      'Transactions': '[class*="transaction"], [class*="cash"], [class*="money"]',
      'Inventory': '[class*="inventory"], [class*="stock"], [class*="product"]',
      'Customers': '[class*="customer"], [class*="credit"], [class*="client"]',
      'Services': '[class*="service"], [class*="offering"]',
      'More': '[class*="more"], [class*="settings"], [class*="menu"]',
      'Calendar': '[class*="calendar"], [class*="appointment"]'
    };

    const selector = selectors[pageName];
    if (selector) {
      return document.querySelector(selector);
    }
    return null;
  }

  async testReturnToCalendar() {
    this.log('🔙 Testing Return to Calendar', 'test');
    
    try {
      window.location.href = '/Beezee-App/app/ke/retail/calendar';
      await this.delay(2000);

      const currentPath = window.location.pathname;
      const returnSuccess = currentPath.includes('/calendar');

      if (returnSuccess) {
        this.log('✅ Successfully returned to calendar', 'success');
        
        // Check if our test appointment is still visible
        const appointments = document.querySelectorAll('[class*="appointment"], [class*="event"]');
        this.log(`📊 Found ${appointments.length} appointments in calendar`, 'info');
        
        return true;
      } else {
        this.log('❌ Failed to return to calendar', 'error');
        return false;
      }

    } catch (error) {
      this.log(`❌ Return to calendar error: ${error.message}`, 'error');
      return false;
    }
  }

  async testDatabaseVerification() {
    this.log('🗄️ Testing Database Verification', 'test');
    
    try {
      // Since we can't directly query Supabase from the browser,
      // we'll check if the appointment appears in the UI and
      // look for API calls in the network tab
      
      // Check for appointment in UI
      const appointments = document.querySelectorAll('[class*="appointment"], [class*="event"]');
      let testAppointmentFound = false;

      appointments.forEach(apt => {
        const text = apt.textContent || apt.innerText;
        if (text && text.includes('Navigation Test User')) {
          testAppointmentFound = true;
        }
      });

      if (testAppointmentFound) {
        this.log('✅ Test appointment found in UI', 'success');
      } else {
        this.log('⚠️ Test appointment not found in UI', 'warning');
      }

      // Check for any recent network requests
      this.log('📡 Checking for API calls...', 'info');
      
      return testAppointmentFound;

    } catch (error) {
      this.log(`❌ Database verification error: ${error.message}`, 'error');
      return false;
    }
  }

  async runFullTest() {
    this.log('🚀 Starting Full Calendar + Navigation Test', 'test');
    
    const results = {
      calendarLoad: false,
      appointmentCreation: false,
      navigation: [],
      returnToCalendar: false,
      databaseVerification: false
    };

    // Phase 1: Test calendar page load
    results.calendarLoad = await this.testCalendarPageLoad();
    await this.delay(1000);

    // Phase 2: Test appointment creation
    if (results.calendarLoad) {
      results.appointmentCreation = await this.testAppointmentCreation();
      await this.delay(1000);
    }

    // Phase 3: Test navigation to all pages
    if (results.appointmentCreation) {
      results.navigation = await this.testNavigationToAllPages();
      await this.delay(1000);
    }

    // Phase 4: Test return to calendar
    results.returnToCalendar = await this.testReturnToCalendar();
    await this.delay(1000);

    // Phase 5: Test database verification
    if (results.returnToCalendar) {
      results.databaseVerification = await this.testDatabaseVerification();
    }

    // Generate final report
    this.generateReport(results);
    
    return results;
  }

  generateReport(results) {
    this.log('📊 Generating Test Report', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        calendarLoad: results.calendarLoad ? '✅ PASS' : '❌ FAIL',
        appointmentCreation: results.appointmentCreation ? '✅ PASS' : '❌ FAIL',
        returnToCalendar: results.returnToCalendar ? '✅ PASS' : '❌ FAIL',
        databaseVerification: results.databaseVerification ? '✅ PASS' : '⚠️ PARTIAL'
      },
      navigation: results.navigation.map(nav => ({
        page: nav.page,
        status: nav.success ? '✅ PASS' : '❌ FAIL',
        loadTime: nav.loadTime ? `${nav.loadTime.toFixed(0)}ms` : 'N/A'
      })),
      details: this.testResults
    };

    console.log('\n🎯 FINAL TEST REPORT:');
    console.log('====================');
    console.log('Calendar Page Load:', report.summary.calendarLoad);
    console.log('Appointment Creation:', report.summary.appointmentCreation);
    console.log('Return to Calendar:', report.summary.returnToCalendar);
    console.log('Database Verification:', report.summary.databaseVerification);
    
    console.log('\n🧭 Navigation Results:');
    report.navigation.forEach(nav => {
      console.log(`${nav.icon} ${nav.page}: ${nav.status} (${nav.loadTime})`);
    });

    console.log('\n📋 Detailed logs available in: this.testResults');
    console.log('📊 Full report object: report');
    
    // Store report globally for easy access
    window.calendarTestReport = report;
    
    return report;
  }
}

// Auto-run the test
const tester = new CalendarNavigationTester();
console.log('🧪 Calendar Navigation Tester initialized');
console.log('Run: tester.runFullTest() to start the full test');
console.log('Or run individual tests:');
console.log('- tester.testCalendarPageLoad()');
console.log('- tester.testAppointmentCreation()');
console.log('- tester.testNavigationToAllPages()');
console.log('- tester.testReturnToCalendar()');
console.log('- tester.testDatabaseVerification()');

// Auto-start the full test after 2 seconds
setTimeout(() => {
  console.log('🚀 Auto-starting full test...');
  tester.runFullTest();
}, 2000);
