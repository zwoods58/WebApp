const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Middleware to check for idempotency
 * Prevents processing the same payment multiple times
 */
async function checkIdempotency(req, res, next) {
  const { dlocal_payment_id, order_id } = req.body;
  
  if (!dlocal_payment_id && !order_id) {
    return next(); // Skip check if no payment identifiers
  }

  try {
    // Check if payment with this ID has already been processed
    const { data, error } = await supabase
      .from('transactions')
      .select('id, status, dlocal_payment_id, order_id')
      .or('dlocal_payment_id.eq.' + dlocal_payment_id, 'order_id.eq.' + order_id)
      .single();

    if (error) {
      console.error('Idempotency check error:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to check idempotency',
        timestamp: new Date().toISOString()
      });
    }

    if (data && data.status !== 'pending') {
      // Payment has already been processed
      return res.status(200).json({
        success: true,
        message: 'Payment already processed',
        payment_id: data.id,
        status: data.status,
        dlocal_payment_id: data.dlocal_payment_id,
        order_id: data.order_id,
        timestamp: new Date().toISOString()
      });
    }

    // Payment hasn't been processed, continue
    next();

  } catch (error) {
    console.error('Idempotency middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Idempotency check failed',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = checkIdempotency;
