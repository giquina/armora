/**
 * Vercel Serverless Function: Process Refund
 *
 * Processes a refund for a Stripe payment
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        error: 'Payment Intent ID is required'
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer',
    });

    res.status(200).json({
      refundId: refund.id,
      status: refund.status,
      amount: refund.amount,
      currency: refund.currency,
    });
  } catch (error: any) {
    console.error('Refund processing error:', error);

    res.status(500).json({
      error: error.message || 'Failed to process refund',
      type: error.type || 'api_error',
    });
  }
}
