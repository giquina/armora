// Supabase Edge Function: Create Payment Intent
// Purpose: Securely create Stripe payment intents for protection assignments
// Uses protection service terminology (not taxi/ride)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentIntentRequest {
  amount: number // in pence
  currency: string
  assignmentId?: string
  metadata?: {
    serviceType?: string
    route?: string
    scheduledTime?: string
    corporateAssignment?: boolean
    principalId?: string
    [key: string]: any
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get Stripe secret key from environment
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Get Supabase client with auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const body: PaymentIntentRequest = await req.json()

    // Validate request
    if (!body.amount || body.amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount. Must be greater than 0.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.currency) {
      body.currency = 'gbp'
    }

    // Calculate VAT (20% for UK)
    const vatRate = 0.20
    const baseAmount = body.amount
    const vatAmount = Math.round(baseAmount * vatRate)
    const totalAmount = baseAmount + vatAmount

    // Calculate marketplace fees
    const baseCost = body.amount; // CPO daily rate in pence
    const clientTotal = Math.round(baseCost * 1.20); // Client pays 20% more
    const platformFee = Math.round(baseCost * 0.35); // Platform takes 35%
    const cpoEarnings = Math.round(baseCost * 0.85); // CPO receives 85%

    // Prepare metadata for Stripe
    const paymentMetadata = {
      principal_id: user.id,
      principal_email: user.email || '',
      service_type: body.metadata?.serviceType || 'protection_assignment',
      route: body.metadata?.route || '',
      scheduled_time: body.metadata?.scheduledTime || '',
      corporate_assignment: String(body.metadata?.corporateAssignment || false),
      base_amount: String(baseAmount),
      vat_amount: String(vatAmount),
      total_amount: String(totalAmount),
      base_cost: baseCost,
      client_total: clientTotal,
      platform_fee: platformFee,
      cpo_earnings: cpoEarnings,
      commission_rate: 0.15,
      assignment_id: body.assignmentId || '',
      created_via: 'armora_edge_function',
      ...body.metadata,
    }

    // Create Stripe Payment Intent - charge client the total with markup
    const paymentIntent = await stripe.paymentIntents.create({
      amount: clientTotal, // Charge client the total with markup
      currency: body.currency.toLowerCase(),
      metadata: paymentMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Armora Protection Assignment: ${body.metadata?.route || 'Service'}`,
      receipt_email: user.email || undefined,
    })

    // Create payment record in database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        assignment_id: body.assignmentId || null,
        stripe_payment_intent_id: paymentIntent.id,
        amount: totalAmount,
        currency: body.currency.toLowerCase(),
        status: 'pending',
        payment_method_type: null, // Will be updated when payment is confirmed
        metadata: paymentMetadata,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error creating payment record:', dbError)
      // Don't fail the request - payment intent is created
    }

    // Store payment split in database
    if (body.assignmentId) {
      await supabase
        .from('protection_assignments')
        .update({
          client_total: clientTotal / 100,
          platform_fee: platformFee / 100,
          cpo_earnings: cpoEarnings / 100,
          commission_rate: 0.15
        })
        .eq('id', body.assignmentId);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: totalAmount,
        currency: body.currency,
        breakdown: {
          base_cost: baseCost / 100,
          client_total: clientTotal / 100,
          platform_fee: platformFee / 100,
          cpo_earnings: cpoEarnings / 100
        },
        paymentRecordId: paymentRecord?.id || null,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating payment intent:', error)

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
        details: 'Failed to create payment intent for protection assignment',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
