/**
 * Vercel Serverless Function: Get Payment Intent Status
 *
 * Retrieves the status of a Stripe payment intent
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Payment Intent ID is required' });
    }

    // Retrieve Payment Intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    res.status(200).json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      metadata: paymentIntent.metadata,
    });
  } catch (error: any) {
    console.error('Payment Intent retrieval error:', error);

    res.status(500).json({
      error: error.message || 'Failed to retrieve payment intent',
      type: error.type || 'api_error',
    });
  }
}
