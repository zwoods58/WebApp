const express = require('express');
const { body, validationResult } = require('express-validator');
const { createPaymentIntent } = require('../services/dlocal');
const verifySupabaseAuth = require('../middleware/auth');
const checkIdempotency = require('../middleware/idempotency');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware for payment creation
const validatePaymentIntent = [
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  body('currency').isIn(['USD', 'KES', 'ZAR', 'NGN']).withMessage('Invalid currency'),
  body('country').isIn(['KE', 'ZA', 'NG']).withMessage('Invalid country code'),
  body('user_id').isUUID().withMessage('Invalid user ID'),
  body('order_id').optional().isString().withMessage('Order ID must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('customer_email').optional().isEmail().withMessage('Invalid email address'),
  body('customer_name').optional().isString().withMessage('Customer name must be a string')
];

/**
 * Create a new payment intent
 * POST /api/payments/create-intent
 */
router.post('/create-intent', 
  verifySupabaseAuth, // Verify request comes from our Supabase functions
  validatePaymentIntent, // Validate request body
  checkIdempotency, // Prevent duplicate processing
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array(),
          timestamp: new Date().toISOString()
        });
      }

      const {
        amount,
        currency,
        country,
        user_id,
        order_id,
        description,
        customer_email,
        customer_name
      } = req.body;

      logger.info('Creating payment intent:', {
        amount,
        currency,
        country,
        user_id,
        order_id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });

      // Create payment intent with dLocal
      const paymentResult = await createPaymentIntent({
        amount: parseFloat(amount),
        currency,
        country,
        orderId: order_id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user_id,
        description: description || `BeeZee Finance payment for ${currency} ${amount}`,
        customerEmail: customer_email,
        customerName: customer_name,
        ipAddress: req.ip
      });

      if (!paymentResult.success) {
        logger.error('Payment intent creation failed:', {
          error: paymentResult.error,
          country,
          amount,
          currency,
          userId: user_id,
          timestamp: new Date().toISOString()
        });

        return res.status(400).json({
          error: 'Payment Failed',
          message: paymentResult.error,
          timestamp: new Date().toISOString()
        });
      }

      // Success response
      logger.info('Payment intent created successfully:', {
        paymentId: paymentResult.paymentId,
        checkoutUrl: paymentResult.checkoutUrl,
        country,
        amount,
        currency,
        userId: user_id,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        payment_id: paymentResult.paymentId,
        checkout_url: paymentResult.checkoutUrl,
        order_id: paymentResult.orderId,
        amount: paymentResult.amount,
        currency: paymentResult.currency,
        country: paymentResult.country,
        status: 'pending',
        created_at: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Unexpected error in payment intent creation:', {
        error: error.message,
        stack: error.stack,
        body: req.body,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to create payment intent',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * Get payment status
 * GET /api/payments/status/:paymentId
 */
router.get('/status/:paymentId', 
  verifySupabaseAuth,
  async (req, res) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        return res.status(400).json({
          error: 'Missing Payment ID',
          message: 'Payment ID is required',
          timestamp: new Date().toISOString()
        });
      }

      // Here you would typically query dLocal for payment status
      // For now, we'll return a placeholder response
      logger.info('Payment status requested:', {
        paymentId,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      res.status(200).json({
        success: true,
        payment_id: paymentId,
        status: 'pending', // This would come from dLocal API
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error fetching payment status:', {
        error: error.message,
        paymentId: req.params.paymentId,
        timestamp: new Date().toISOString()
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch payment status',
        timestamp: new Date().toISOString()
      });
    }
  }
);

/**
 * Cancel payment
 * POST /api/payments/cancel/:paymentId
 */
router.post('/cancel/:paymentId', 
  verifySupabaseAuth,
  async (req, res) => {
    try {
      const { paymentId } = req.params;

      logger.info('Payment cancellation requested:', {
        paymentId,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });

      // Implement dLocal cancellation logic here
      // For now, return success response
      res.status(200).json({
        success: true,
        payment_id: paymentId,
        status: 'cancelled',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Error cancelling payment:', {
        error: error.message,
        paymentId: req.params.paymentId,
        timestamp: new Date().toISOString()
      });

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to cancel payment',
        timestamp: new Date().toISOString()
      });
    }
  }
);

module.exports = router;
