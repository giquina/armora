import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayoutRequest {
  assignmentId: string
  cpoId: string
  amount: number
  currency?: string
}

interface PayoutResponse {
  success: boolean
  payoutId?: string
  transferId?: string
  amount: number
  cpoId: string
  assignmentId: string
  status: string
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify authentication (admin only)
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { assignmentId, cpoId, amount, currency = 'gbp' }: PayoutRequest = await req.json()

    // Validate inputs
    if (!assignmentId || !cpoId || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid assignment ID, CPO ID, or amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get CPO Stripe Connect account ID
    const { data: cpoProfile, error: cpoError } = await supabaseClient
      .from('profiles')
      .select('stripe_connect_account_id, full_name')
      .eq('id', cpoId)
      .eq('role', 'protection_officer')
      .single()

    if (cpoError || !cpoProfile || !cpoProfile.stripe_connect_account_id) {
      return new Response(
        JSON.stringify({ error: 'CPO not found or Stripe Connect account not configured' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get assignment details
    const { data: assignment, error: assignmentError } = await supabaseClient
      .from('protection_assignments')
      .select('status, payment_status, total_amount')
      .eq('id', assignmentId)
      .single()

    if (assignmentError || !assignment) {
      return new Response(
        JSON.stringify({ error: 'Assignment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify assignment is completed and payment received
    if (assignment.status !== 'completed' || assignment.payment_status !== 'succeeded') {
      return new Response(
        JSON.stringify({ error: 'Assignment must be completed and payment received before payout' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Convert amount to smallest currency unit (pence for GBP)
    const amountInPence = Math.round(amount * 100)

    // Create Stripe transfer to CPO's Connect account
    const transfer = await stripe.transfers.create({
      amount: amountInPence,
      currency: currency,
      destination: cpoProfile.stripe_connect_account_id,
      description: `Payout for assignment ${assignmentId}`,
      metadata: {
        assignment_id: assignmentId,
        cpo_id: cpoId,
        cpo_name: cpoProfile.full_name || 'Unknown',
      },
    })

    // Record payout in database
    const { data: payout, error: payoutError } = await supabaseClient
      .from('cpo_payouts')
      .insert({
        cpo_id: cpoId,
        assignment_id: assignmentId,
        amount: amount,
        currency: currency,
        stripe_transfer_id: transfer.id,
        status: 'completed',
        processed_at: new Date().toISOString(),
        processed_by: user.id,
      })
      .select()
      .single()

    if (payoutError) {
      console.error('Error recording payout:', payoutError)
      // Transfer succeeded but database record failed - log for manual reconciliation
      return new Response(
        JSON.stringify({
          error: 'Payout processed but database record failed',
          transferId: transfer.id,
          amount: amount,
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update assignment payout status
    await supabaseClient
      .from('protection_assignments')
      .update({
        payout_status: 'completed',
        payout_id: payout.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignmentId)

    const response: PayoutResponse = {
      success: true,
      payoutId: payout.id,
      transferId: transfer.id,
      amount: amount,
      cpoId: cpoId,
      assignmentId: assignmentId,
      status: 'completed',
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing CPO payout:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        status: 'failed',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
