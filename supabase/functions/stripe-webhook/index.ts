// Stripe Webhook Handler for Armora Protection Service
// Handles payment events and updates assignment status

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response(
      JSON.stringify({ error: 'No signature provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.text();

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log(`✅ Webhook verified: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log(`💰 Payment succeeded: ${paymentIntent.id}`);

  try {
    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'succeeded',
        stripe_charge_id: paymentIntent.latest_charge as string,
        stripe_payment_method_id: paymentIntent.payment_method as string,
        payment_method_type: paymentIntent.payment_method_types?.[0] || 'card',
        succeeded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .select()
      .single();

    if (paymentError) {
      console.error('Error updating payment:', paymentError);
      return;
    }

    console.log(`✅ Payment record updated for: ${payment.id}`);

    // Update associated protection assignment if exists
    if (payment.assignment_id) {
      const { error: assignmentError } = await supabase
        .from('protection_assignments')
        .update({
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.assignment_id);

      if (assignmentError) {
        console.error('Error updating assignment:', assignmentError);
      } else {
        console.log(`✅ Protection assignment confirmed: ${payment.assignment_id}`);
      }

      // TODO: Send confirmation notification to Principal
      // TODO: Notify CPO assignment system
      // TODO: Send email confirmation with protection detail information
    }

  } catch (error) {
    console.error('Error in handlePaymentSuccess:', error);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);

  try {
    // Update payment record with failure details
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'failed',
        error_message: paymentIntent.last_payment_error?.message || 'Payment failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id);

    if (error) {
      console.error('Error updating failed payment:', error);
      return;
    }

    // Get associated assignment to notify user
    const { data: payment } = await supabase
      .from('payments')
      .select('assignment_id, user_id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (payment?.assignment_id) {
      // Update assignment status
      await supabase
        .from('protection_assignments')
        .update({
          payment_status: 'failed',
          status: 'payment_failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.assignment_id);

      // TODO: Send payment failure notification to Principal
      // TODO: Provide retry instructions
    }

  } catch (error) {
    console.error('Error in handlePaymentFailure:', error);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  console.log(`🔄 Refund processed: ${charge.id}`);

  try {
    const paymentIntentId = charge.payment_intent as string;

    // Update payment record
    const { error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntentId);

    if (error) {
      console.error('Error updating refunded payment:', error);
      return;
    }

    // Get associated assignment
    const { data: payment } = await supabase
      .from('payments')
      .select('assignment_id, user_id, amount')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (payment?.assignment_id) {
      // Update assignment status
      await supabase
        .from('protection_assignments')
        .update({
          payment_status: 'refunded',
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.assignment_id);

      // TODO: Send refund confirmation to Principal
      // TODO: Update CPO availability
      console.log(`✅ Refund processed for assignment: ${payment.assignment_id}`);
    }

  } catch (error) {
    console.error('Error in handleRefund:', error);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log(`📋 Subscription updated: ${subscription.id}`);

  try {
    const userId = subscription.metadata.user_id;
    if (!userId) {
      console.error('No user_id in subscription metadata');
      return;
    }

    // Upsert subscription record
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'stripe_subscription_id'
      });

    if (error) {
      console.error('Error updating subscription:', error);
      return;
    }

    console.log(`✅ Subscription record updated for user: ${userId}`);

    // TODO: Send subscription confirmation email
    // TODO: Activate 50% discount for protection services

  } catch (error) {
    console.error('Error in handleSubscriptionUpdate:', error);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  console.log(`❌ Subscription cancelled: ${subscription.id}`);

  try {
    // Update subscription status
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error cancelling subscription:', error);
      return;
    }

    // TODO: Send cancellation confirmation
    // TODO: Remove discount benefits at period end

  } catch (error) {
    console.error('Error in handleSubscriptionCancellation:', error);
  }
}
