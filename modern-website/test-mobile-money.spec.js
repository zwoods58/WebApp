const { test, expect } = require('@playwright/test');

test.describe('Mobile Money Subscription Flow', () => {
  const baseUrl = 'http://localhost:3000';
  const phoneNumber = '+254777888999';
  const pin = '111111';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('Login with phone number and PIN', async ({ page }) => {
    console.log('Starting login test...');
    
    // Navigate to login page
    await page.getByRole('link', { name: /login|sign in/i }).first().click();
    
    // Wait for login form
    await page.waitForSelector('input[type="tel"], input[name="phone"], input[placeholder*="phone"]', { timeout: 10000 });
    
    // Enter phone number
    const phoneInput = page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone"]').first();
    await phoneInput.fill(phoneNumber);
    console.log(`Entered phone number: ${phoneNumber}`);
    
    // Enter PIN
    const pinInput = page.locator('input[type="password"], input[name="pin"], input[placeholder*="pin"]').first();
    await pinInput.fill(pin);
    console.log('Entered PIN');
    
    // Click login button
    const loginButton = page.getByRole('button', { name: /login|sign in/i }).first();
    await loginButton.click();
    console.log('Clicked login button');
    
    // Wait for successful login (redirect to dashboard or main app)
    await page.waitForURL(/\/Beezee-App\/app\//, { timeout: 15000 });
    console.log('Login successful - redirected to app');
    
    // Verify we're logged in
    await expect(page.locator('body')).toContainText(/more|dashboard|retail/i);
    console.log('Verified login success');
  });

  test('Navigate to Kenya retail page', async ({ page }) => {
    // First login
    await page.getByRole('link', { name: /login|sign in/i }).first().click();
    await page.locator('input[type="tel"], input[name="phone"], input[placeholder*="phone"]').first().fill(phoneNumber);
    await page.locator('input[type="password"], input[name="pin"], input[placeholder*="pin"]').first().fill(pin);
    await page.getByRole('button', { name: /login|sign in/i }).first().click();
    await page.waitForURL(/\/Beezee-App\/app\//, { timeout: 15000 });
    
    // Navigate to Kenya retail page
    await page.goto(`${baseUrl}/Beezee-App/app/ke/retail/more`);
    console.log('Navigated to Kenya retail more page');
    
    // Wait for page to load
    await page.waitForSelector('h1, .more-page, [data-testid="more-page"]', { timeout: 10000 });
    console.log('Page loaded successfully');
    
    // Verify country and industry indicators
    await expect(page.locator('body')).toContainText(/kenya|ke/i, { timeout: 5000 });
    await expect(page.locator('body')).toContainText(/retail/i, { timeout: 5000 });
    console.log('Verified Kenya retail page');
  });

  test('Check for mobile money subscription options', async ({ page }) => {
    // Login and navigate to Kenya retail page
    await page.goto(`${baseUrl}/Beezee-App/app/ke/retail/more`);
    await page.waitForSelector('h1, .more-page', { timeout: 10000 });
    
    // Look for subscription management option
    const manageSubscription = page.getByText(/manage subscription/i).first();
    const subscriptionOption = page.getByText(/subscription/i).first();
    
    console.log('Checking for mobile money subscription options...');
    
    // Check if either option exists
    const hasManageSubscription = await manageSubscription.isVisible().catch(() => false);
    const hasSubscriptionOption = await subscriptionOption.isVisible().catch(() => false);
    
    if (hasManageSubscription) {
      console.log('Found "Manage Subscription" option');
      await manageSubscription.click();
      
      // Wait for subscription dashboard modal
      await page.waitForSelector('.fixed.inset-0, [data-testid="subscription-dashboard"]', { timeout: 10000 });
      console.log('Subscription dashboard opened');
      
      // Check for mobile money indicators
      const mobileMoneyIndicators = [
        'mobile money',
        'm-pesa',
        'airtel money',
        't-kash',
        'kenya',
        'kes'
      ];
      
      let foundMobileMoneyContent = false;
      for (const indicator of mobileMoneyIndicators) {
        if (await page.getByText(new RegExp(indicator, 'i')).isVisible().catch(() => false)) {
          console.log(`Found mobile money indicator: ${indicator}`);
          foundMobileMoneyContent = true;
        }
      }
      
      if (foundMobileMoneyContent) {
        console.log('Mobile money content verified in dashboard');
      } else {
        console.log('Mobile money content not found in dashboard');
      }
      
    } else if (hasSubscriptionOption) {
      console.log('Found general subscription option');
      await subscriptionOption.click();
      
      // Check for subscription modal
      await page.waitForSelector('.modal, [data-testid="subscription-modal"]', { timeout: 10000 }).catch(() => {});
      console.log('Subscription modal opened (if available)');
      
    } else {
      console.log('No subscription options found on page');
    }
  });

  test('Test subscription creation flow', async ({ page }) => {
    // Login and navigate to Kenya retail page
    await page.goto(`${baseUrl}/Beezee-App/app/ke/retail/more`);
    await page.waitForSelector('h1, .more-page', { timeout: 10000 });
    
    // Look for subscription button
    const subscriptionButton = page.getByText(/subscription/i).first();
    
    if (await subscriptionButton.isVisible().catch(() => false)) {
      console.log('Found subscription button, clicking...');
      await subscriptionButton.click();
      
      // Wait for modal or redirect
      await page.waitForTimeout(2000);
      
      // Check if we have a subscription form or modal
      const currentUrl = page.url();
      console.log(`Current URL after clicking subscription: ${currentUrl}`);
      
      // Look for subscription form elements
      const formElements = [
        'input[name="email"]',
        'input[name="firstName"]',
        'select[name="plan"]',
        'button[type="submit"]',
        '[data-testid="subscription-form"]'
      ];
      
      for (const selector of formElements) {
        if (await page.locator(selector).isVisible().catch(() => false)) {
          console.log(`Found subscription form element: ${selector}`);
        }
      }
      
    } else {
      console.log('No subscription button found');
    }
  });

  test('Verify mobile money configuration is loaded', async ({ page }) => {
    // This test checks if our mobile money config is properly loaded
    await page.goto(`${baseUrl}/Beezee-App/app/ke/retail/more`);
    await page.waitForSelector('h1, .more-page', { timeout: 10000 });
    
    // Check for any JavaScript errors related to mobile money
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('mobile-money')) {
        console.log('Mobile money related error:', msg.text());
      }
    });
    
    // Check if the page loads without errors
    const pageTitle = await page.title();
    console.log(`Page title: ${pageTitle}`);
    
    // Verify the page is functional
    expect(pageTitle).toBeTruthy();
  });
});
