// Test file to verify the low stock fix
// This can be run in the browser console to test the logic

// Mock data for testing
const mockInventoryData = [
  { id: 1, item_name: 'Item 1', quantity: 5, threshold: 10, business_id: 'test-business' }, // Low stock
  { id: 2, item_name: 'Item 2', quantity: 15, threshold: 10, business_id: 'test-business' }, // Normal stock
  { id: 3, item_name: 'Item 3', quantity: 0, threshold: 5, business_id: 'test-business' },  // Out of stock
  { id: 4, item_name: 'Item 4', quantity: 10, threshold: 10, business_id: 'test-business' }, // At threshold
];

// Test the filtering logic (same as the fix)
function testLowStockFiltering() {
  console.log('Testing low stock filtering logic...');
  
  // Filter items that are below threshold but still have some stock
  const lowStockItems = mockInventoryData.filter(item => 
    item.quantity > 0 && item.quantity < item.threshold
  );
  
  // Filter out of stock items
  const outOfStockItems = mockInventoryData.filter(item => item.quantity === 0);
  
  console.log('All items:', mockInventoryData);
  console.log('Low stock items:', lowStockItems);
  console.log('Out of stock items:', outOfStockItems);
  
  // Expected results:
  // Low stock: Item 1 (5 < 10)
  // Out of stock: Item 3 (0 === 0)
  // Normal: Item 2 (15 > 10), Item 4 (10 === 10, not below)
  
  const expectedLowStock = 1;
  const expectedOutOfStock = 1;
  
  console.log('Expected low stock items:', expectedLowStock);
  console.log('Expected out of stock items:', expectedOutOfStock);
  
  if (lowStockItems.length === expectedLowStock && outOfStockItems.length === expectedOutOfStock) {
    console.log('✅ Test PASSED: Filtering logic works correctly');
  } else {
    console.log('❌ Test FAILED: Filtering logic has issues');
  }
}

// Test the old problematic query (what was causing the error)
function testOldQueryLogic() {
  console.log('\nTesting old problematic query logic...');
  
  // This is what the old code was trying to do (and failing):
  // .lte('quantity', 'threshold') - comparing numeric field with string
  
  try {
    // This would fail in the database, but let's see what happens in JavaScript
    const problematicFilter = mockInventoryData.filter(item => item.quantity <= 'threshold');
    console.log('Problematic filter result:', problematicFilter);
    console.log('❌ This approach is wrong - comparing number with string');
  } catch (error) {
    console.log('Error with problematic approach:', error);
  }
}

// Run the tests
testLowStockFiltering();
testOldQueryLogic();

console.log('\n🔧 Fix Summary:');
console.log('1. Changed from database column comparison to client-side filtering');
console.log('2. Fetch all items first, then filter in JavaScript');
console.log('3. This avoids the "invalid input syntax for type numeric" error');
console.log('4. Also optimized to use single database query instead of two');
