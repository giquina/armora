/**
 * Stripe Payment Service
 * Handles payment processing for Armora Protection Services
 */

import { supabase } from '../lib/supabase';
import { PaymentFlow, PaymentIntent, PaymentError } from '../types';

const STRIPE_API_URL = 'https://api.stripe.com/v1';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

export class StripePaymentService {
  /**
   * Create a payment intent for a protection assignment
   */
  static async createPaymentIntent(
    paymentFlow: PaymentFlow
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      // Create payment record in Supabase first
      const { data: paymentRecord, error: dbError } = await supabase
        .from('payments')
        .insert({
          amount: paymentFlow.amount,
          currency: paymentFlow.currency,
          description: paymentFlow.description,
          metadata: paymentFlow.metadata,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        console.error('Failed to create payment record:', dbError);
        throw new Error('Failed to initialize payment');
      }

      // Create Stripe Payment Intent via backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentFlow.amount,
          currency: paymentFlow.currency,
          description: paymentFlow.description,
          metadata: {
            ...paymentFlow.metadata,
            payment_record_id: paymentRecord.id,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();

      return {
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId,
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  }

  /**
   * Confirm payment and process booking
   */
  static async confirmPayment(
    paymentIntentId: string,
    paymentFlow: PaymentFlow
  ): Promise<PaymentIntent> {
    try {
      // Update payment record in Supabase
      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          status: 'succeeded',
          payment_intent_id: paymentIntentId,
          completed_at: new Date().toISOString(),
        })
        .eq('payment_intent_id', paymentIntentId)
        .select()
        .single();

      if (error) {
        console.error('Failed to update payment record:', error);
        throw new Error('Payment confirmation failed');
      }

      // Create protection assignment booking
      const { data: booking, error: bookingError } = await supabase
        .from('protection_assignments')
        .insert({
          user_id: paymentFlow.metadata.userId,
          service_type: paymentFlow.metadata.serviceType,
          pickup_location: paymentFlow.metadata.pickupLocation,
          dropoff_location: paymentFlow.metadata.dropoffLocation,
          scheduled_time: paymentFlow.metadata.scheduledTime,
          estimated_duration: paymentFlow.metadata.estimatedDuration,
          estimated_cost: paymentFlow.amount,
          payment_id: payment.id,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Failed to create booking:', bookingError);
        throw new Error('Booking creation failed');
      }

      return {
        id: paymentIntentId,
        amount: paymentFlow.amount,
        currency: paymentFlow.currency,
        status: 'succeeded',
        clientSecret: '',
        bookingId: booking.id,
        created: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Payment confirmation error:', error);
      throw error;
    }
  }

  /**
   * Handle payment errors
   */
  static handlePaymentError(error: any): PaymentError {
    const paymentError: PaymentError = {
      code: error.code || 'payment_failed',
      message: error.message || 'Payment processing failed',
      type: error.type || 'api_error',
      declineCode: error.decline_code,
    };

    return paymentError;
  }

  /**
   * Retrieve payment intent status
   */
  static async getPaymentIntent(paymentIntentId: string): Promise<any> {
    try {
      const response = await fetch(`/api/payment-intent/${paymentIntentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get payment intent:', error);
      throw error;
    }
  }

  /**
   * Process refund for a payment
   */
  static async processRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Refund processing failed');
      }

      // Update payment record
      await supabase
        .from('payments')
        .update({
          status: 'refunded',
          refunded_at: new Date().toISOString(),
        })
        .eq('payment_intent_id', paymentIntentId);
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  }
}
