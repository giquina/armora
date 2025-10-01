/**
 * Vercel Serverless Function: Create Stripe Payment Intent
 *
 * This API endpoint creates a Stripe payment intent for protection assignments
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
    const { amount, currency, description, metadata } = req.body;

    // Validate required fields
    if (!amount || !currency) {
      return res.status(400).json({
        error: 'Missing required fields: amount and currency'
      });
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure it's an integer (pence)
      currency: currency.toLowerCase(),
      description: description || 'Armora Protection Service',
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return client secret and payment intent ID
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment Intent creation error:', error);

    res.status(500).json({
      error: error.message || 'Failed to create payment intent',
      type: error.type || 'api_error',
    });
  }
}
