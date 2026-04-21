// Test to verify the payment method fix
const { z } = require('zod');

// Simulate the fixed validation schema
const transactionSchema = z.object({
  business_id: z.string().uuid(),
  type: z.enum(['money_in', 'money_out']),
  industry: z.string().min(2).max(50),
  amount: z.number().positive(),
  currency: z.string().length(3),
  category: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  customer_name: z.string().max(100).optional(),
  payment_method: z.enum(['cash', 'mobile_money', 'credit']).optional(),
  transaction_date: z.string().optional()
});

// Test the transaction payload that was failing
const testTransaction = {
  amount: 50,
  business_id: "83243bd1-2004-4086-a698-7cf59a26c691",
  category: "sales",
  currency: "KES",
  customer_name: "dave",
  description: "test",
  industry: "retail",
  payment_method: "mobile_money",
  transaction_date: "2026-04-21",
  type: "money_in"
};

console.log('Testing transaction validation...');
try {
  const result = transactionSchema.parse(testTransaction);
  console.log('SUCCESS: Transaction validated successfully!');
  console.log('Validated data:', result);
} catch (error) {
  console.log('FAILED: Validation error:', error.message);
}

// Test all three payment methods
const paymentMethods = ['cash', 'mobile_money', 'credit'];
paymentMethods.forEach(method => {
  const test = { ...testTransaction, payment_method: method };
  try {
    transactionSchema.parse(test);
    console.log(`SUCCESS: ${method} payment method validated`);
  } catch (error) {
    console.log(`FAILED: ${method} payment method - ${error.message}`);
  }
});

// Test old payment methods should fail
const oldMethods = ['mpesa', 'bank', 'card', 'other'];
oldMethods.forEach(method => {
  const test = { ...testTransaction, payment_method: method };
  try {
    transactionSchema.parse(test);
    console.log(`UNEXPECTED: ${method} should have failed but passed`);
  } catch (error) {
    console.log(`EXPECTED: ${method} correctly rejected`);
  }
});
