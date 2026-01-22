const express = require('express');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { verifyWebhookSignature } = require('../services/dlocal');
const logger = require('../utils/logger');

const router = express.Router();

// Initialize Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * dLocal webhook handler
 * POST /api/webhooks/dlocal
 */
router.post('/dlocal', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.get('X-Signature');
    const body = req.body;

    if (!signature) {
      logger.warn('Webhook received without signature:', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({
        error: 'Missing Signature',
        message: 'Webhook signature is required',
        timestamp: new Date().toISOString()
      });
    }

    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(body, signature);
    
    if (!isValidSignature) {
      logger.error('Invalid webhook signature:', {
        signature,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({
        error: 'Invalid Signature',
        message: 'Webhook signature verification failed',
        timestamp: new Date().toISOString()
      });
    }

    const webhookData = JSON.parse(body);
    
    logger.info('dLocal webhook received:', {
      type: webhookData.type,
      status: webhookData.status,
      paymentId: webhookData.payment_id,
      orderId: webhookData.order_id,
      amount: webhookData.amount,
      currency: webhookData.currency,
      country: webhookData.country,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    // Process different webhook events
    switch (webhookData.type) {
      case 'payment.success':
        await handleSuccessfulPayment(webhookData);
        break;
        
      case 'payment.failed':
        await handleFailedPayment(webhookData);
        break;
        
      case 'payment.cancelled':
        await handleCancelledPayment(webhookData);
        break;
        
      case 'payment.pending':
        await handlePendingPayment(webhookData);
        break;
        
      default:
        logger.warn('Unknown webhook type:', {
          type: webhookData.type,
          paymentId: webhookData.payment_id,
          timestamp: new Date().toISOString()
        });
    }

    // Acknowledge receipt of webhook
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error processing dLocal webhook:', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process webhook',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(data) {
  try {
    // Calculate tax amounts (15% placeholder rate)
    const taxRate = 0.15;
    const grossAmount = parseFloat(data.amount);
    const taxAmount = grossAmount * taxRate;
    const netAmount = grossAmount - taxAmount;

    // Update transaction in Supabase
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        gross_amount: grossAmount,
        tax_amount: taxAmount,
        net_amount: netAmount,
        tax_rate: taxRate,
        payment_provider: 'dlocal',
        webhook_data: data
      })
      .eq('dlocal_payment_id', data.payment_id)
      .eq('status', 'pending');

    if (error) {
      logger.error('Failed to update successful payment:', {
        error: error.message,
        paymentId: data.payment_id,
        orderId: data.order_id,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    // Update user statistics
    await updateUserStats(data.user_id, grossAmount, data.country);

    logger.info('Payment processed successfully:', {
      paymentId: data.payment_id,
      orderId: data.order_id,
      amount: grossAmount,
      currency: data.currency,
      country: data.country,
      taxAmount,
      netAmount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling successful payment:', {
      error: error.message,
      paymentId: data.payment_id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(data) {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_reason: data.failure_reason || 'Payment declined',
        webhook_data: data
      })
      .eq('dlocal_payment_id', data.payment_id)
      .eq('status', 'pending');

    if (error) {
      logger.error('Failed to update failed payment:', {
        error: error.message,
        paymentId: data.payment_id,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    logger.info('Payment marked as failed:', {
      paymentId: data.payment_id,
      orderId: data.order_id,
      reason: data.failure_reason,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling failed payment:', {
      error: error.message,
      paymentId: data.payment_id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Handle cancelled payment
 */
async function handleCancelledPayment(data) {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        webhook_data: data
      })
      .eq('dlocal_payment_id', data.payment_id)
      .eq('status', 'pending');

    if (error) {
      logger.error('Failed to update cancelled payment:', {
        error: error.message,
        paymentId: data.payment_id,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    logger.info('Payment marked as cancelled:', {
      paymentId: data.payment_id,
      orderId: data.order_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling cancelled payment:', {
      error: error.message,
      paymentId: data.payment_id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Handle pending payment
 */
async function handlePendingPayment(data) {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({
        status: 'pending',
        pending_at: new Date().toISOString(),
        webhook_data: data
      })
      .eq('dlocal_payment_id', data.payment_id);

    if (error) {
      logger.error('Failed to update pending payment:', {
        error: error.message,
        paymentId: data.payment_id,
        timestamp: new Date().toISOString()
      });
      throw error;
    }

    logger.info('Payment marked as pending:', {
      paymentId: data.payment_id,
      orderId: data.order_id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling pending payment:', {
      error: error.message,
      paymentId: data.payment_id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Update user statistics
 */
async function updateUserStats(userId, amount, country) {
  try {
    // Update total revenue
    const { error: revenueError } = await supabase.rpc('increment_user_revenue', {
      user_id: userId,
      amount: amount,
      country: country
    });

    // Update transaction count
    const { error: countError } = await supabase.rpc('increment_user_transactions', {
      user_id: userId
    });

    if (revenueError || countError) {
      logger.error('Failed to update user stats:', {
        revenueError: revenueError?.message,
        countError: countError?.message,
        userId,
        amount,
        country,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    logger.error('Error updating user stats:', {
      error: error.message,
      userId,
      amount,
      country,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = router;
