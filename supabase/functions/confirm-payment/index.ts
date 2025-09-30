// Confirm Payment and Finalize Protection Assignment
// Verifies payment success and creates/finalizes assignment record

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ConfirmPaymentRequest {
  paymentIntentId: string;
  userId: string;
  assignmentData?: {
    pickupLocation: string;
    pickupCoordinates?: { lat: number; lng: number };
    dropoffLocation?: string;
    dropoffCoordinates?: { lat: number; lng: number };
    serviceType: string;
    scheduledTime: string;
    estimatedDuration: number;
    estimatedDistance?: number;
    specialRequirements?: string;
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { paymentIntentId, userId, assignmentData }: ConfirmPaymentRequest = await req.json();

    if (!paymentIntentId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // 1. Verify payment intent succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return new Response(
        JSON.stringify({
          error: 'Payment not completed',
          status: paymentIntent.status
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    console.log(`✅ Payment verified: ${paymentIntentId}`);

    // 2. Get or create payment record
    let { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (paymentError && paymentError.code !== 'PGRST116') {
      throw paymentError;
    }

    if (!payment) {
      // Create payment record if it doesn't exist
      const { data: newPayment, error: createError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          stripe_payment_intent_id: paymentIntentId,
          stripe_charge_id: paymentIntent.latest_charge as string,
          stripe_payment_method_id: paymentIntent.payment_method as string,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          payment_method_type: paymentIntent.payment_method_types?.[0] || 'card',
          succeeded_at: new Date().toISOString(),
          metadata: paymentIntent.metadata,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      payment = newPayment;
    }

    // 3. Create or finalize protection assignment
    let assignment;

    if (assignmentData) {
      // Create new assignment
      const { data: newAssignment, error: assignmentError } = await supabase
        .from('protection_assignments')
        .insert({
          client_id: userId,
          service_level: assignmentData.serviceType,
          pickup_location: assignmentData.pickupLocation,
          pickup_coordinates: assignmentData.pickupCoordinates
            ? `POINT(${assignmentData.pickupCoordinates.lng} ${assignmentData.pickupCoordinates.lat})`
            : null,
          dropoff_location: assignmentData.dropoffLocation,
          dropoff_coordinates: assignmentData.dropoffCoordinates
            ? `POINT(${assignmentData.dropoffCoordinates.lng} ${assignmentData.dropoffCoordinates.lat})`
            : null,
          scheduled_time: assignmentData.scheduledTime,
          estimated_duration: assignmentData.estimatedDuration,
          estimated_distance: assignmentData.estimatedDistance,
          special_requirements: assignmentData.specialRequirements,
          status: 'confirmed',
          payment_status: 'paid',
          total_amount: payment.amount,
        })
        .select()
        .single();

      if (assignmentError) {
        throw assignmentError;
      }

      assignment = newAssignment;

      // Link payment to assignment
      await supabase
        .from('payments')
        .update({ assignment_id: assignment.id })
        .eq('id', payment.id);

      console.log(`✅ Protection assignment created: ${assignment.id}`);

    } else if (payment.assignment_id) {
      // Update existing assignment
      const { data: existingAssignment, error: updateError } = await supabase
        .from('protection_assignments')
        .update({
          status: 'confirmed',
          payment_status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.assignment_id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      assignment = existingAssignment;
      console.log(`✅ Protection assignment updated: ${assignment.id}`);
    }

    // 4. TODO: Match with available CPO
    // This would integrate with your CPO matching system
    // For now, we'll leave the officer_id null and handle matching separately

    // 5. TODO: Send confirmation notifications
    // - Email to Principal with protection detail information
    // - SMS/Push notification
    // - Notify CPO assignment system

    // 6. Return success response
    return new Response(
      JSON.stringify({
        success: true,
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        },
        assignment: assignment ? {
          id: assignment.id,
          status: assignment.status,
          serviceLevel: assignment.service_level,
          scheduledTime: assignment.scheduled_time,
          pickupLocation: assignment.pickup_location,
          dropoffLocation: assignment.dropoff_location,
        } : null,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error: any) {
    console.error('Error confirming payment:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
        details: error.toString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
});
