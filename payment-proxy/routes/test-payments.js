const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Test payment endpoint (without dLocal)
router.post('/test-intent', [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive'),
  body('currency').isIn(['USD', 'KES', 'ZAR', 'NGN']).withMessage('Invalid currency'),
  body('country').isIn(['KE', 'ZA', 'NG']).withMessage('Invalid country code'),
  body('user_id').isUUID().withMessage('Invalid user ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation Error',
        details: errors.array(),
        timestamp: new Date().toISOString()
      });
    }

    const { amount, currency, country, user_id, description } = req.body;

    // Mock tax calculation
    let taxRate = 0.15; // Default 15%
    if (country === 'KE') taxRate = 0.16;
    if (country === 'ZA') taxRate = 0.15;
    if (country === 'NG') taxRate = 0.075;

    const taxAmount = amount * taxRate;
    const netAmount = amount - taxAmount;

    // Mock payment response
    const mockPayment = {
      success: true,
      payment_id: `test_payment_${Date.now()}`,
      checkout_url: `https://mock-checkout.beezee.com/pay/${Date.now()}`,
      order_id: `order_${Date.now()}`,
      amount: amount,
      currency: currency,
      country: country,
      status: 'pending',
      tax_amount: taxAmount,
      net_amount: netAmount,
      tax_rate: taxRate,
      user_id: user_id,
      description: description || 'Test payment',
      created_at: new Date().toISOString()
    };

    console.log('Test payment created:', mockPayment);

    res.status(200).json(mockPayment);

  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Test payment creation failed',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
