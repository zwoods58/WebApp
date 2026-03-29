// Test script to create various types of notifications
// Run this in browser console on the dashboard page

async function createTestNotifications() {
  console.log('Creating test notifications...');
  
  // Get business info from localStorage
  const sessionData = localStorage.getItem('sessionData');
  const userProfile = localStorage.getItem('userProfile');
  
  if (!sessionData || !userProfile) {
    console.error('No user session found. Please sign in first.');
    return;
  }
  
  const session = JSON.parse(sessionData);
  const profile = JSON.parse(userProfile);
  const businessId = profile.businessId || session.userId;
  
  console.log('Creating notifications for business:', businessId);
  
  try {
    // Test 1: Create a money in notification (sale)
    console.log('Creating money in notification...');
    const moneyInResponse = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        industry: profile.industry || 'retail',
        amount: 2500,
        category: 'sale',
        description: 'Test sale for notification',
        customer_name: 'John Doe',
        payment_method: 'cash',
        transaction_date: new Date().toISOString().split('T')[0]
      })
    });
    
    if (moneyInResponse.ok) {
      console.log('✅ Money in notification created!');
    } else {
      console.error('❌ Failed to create money in notification:', await moneyInResponse.text());
    }
    
    // Wait a bit before next test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Create a money out notification (expense)
    console.log('Creating money out notification...');
    const moneyOutResponse = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        industry: profile.industry || 'retail',
        amount: 500,
        category: 'supplies',
        description: 'Test expense for notification',
        supplier: 'Test Supplier',
        expense_date: new Date().toISOString().split('T')[0]
      })
    });
    
    if (moneyOutResponse.ok) {
      console.log('✅ Money out notification created!');
    } else {
      console.error('❌ Failed to create money out notification:', await moneyOutResponse.text());
    }
    
    // Wait a bit before next test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 3: Create a low inventory item
    console.log('Creating low inventory notification...');
    const inventoryResponse = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        industry: profile.industry || 'retail',
        item_name: 'Test Product',
        category: 'test',
        cost_price: 100,
        selling_price: 150,
        quantity: 2,  // Low stock
        threshold: 5,  // Will trigger low stock alert
        unit: 'pieces',
        supplier: 'Test Supplier'
      })
    });
    
    if (inventoryResponse.ok) {
      console.log('✅ Low inventory notification created!');
    } else {
      console.error('❌ Failed to create inventory notification:', await inventoryResponse.text());
    }
    
    // Wait a bit before next test
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 4: Create an overdue credit
    console.log('Creating overdue credit notification...');
    const creditResponse = await fetch('/api/credit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        industry: profile.industry || 'retail',
        customer_name: 'Test Customer',
        customer_phone: '+254700123456',
        amount: 1000,
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        notes: 'Test overdue credit',
        date_given: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 5 days ago
      })
    });
    
    if (creditResponse.ok) {
      console.log('✅ Overdue credit notification created!');
    } else {
      console.error('❌ Failed to create credit notification:', await creditResponse.text());
    }
    
    console.log('🎉 All test notifications created!');
    console.log('📱 Check the notification bell - you should see multiple notifications now.');
    console.log('🔄 The page should refresh automatically to show the new notifications.');
    
    // Refresh the page to show notifications
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    
  } catch (error) {
    console.error('❌ Error creating test notifications:', error);
  }
}

// Run the test
createTestNotifications();
