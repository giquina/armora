import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FeeCalculationRequest {
  baseRate: number
  hours: number
  protectionLevel: 'essential' | 'executive' | 'shadow_protocol' | 'client_vehicle'
}

interface FeeCalculationResponse {
  baseRate: number
  hours: number
  subtotal: number
  clientPays: number
  platformFee: number
  cpoReceives: number
  breakdown: {
    clientMarkup: number // 20%
    platformFeePercentage: number // 35% of base
    cpoPercentage: number // 85% of base (15% platform fee)
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    // Verify authentication
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

    // Parse request body
    const { baseRate, hours, protectionLevel }: FeeCalculationRequest = await req.json()

    // Validate inputs
    if (!baseRate || !hours || baseRate <= 0 || hours <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid baseRate or hours' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate fees based on marketplace model
    const subtotal = baseRate * hours

    // Client pays 120% of base rate (20% markup)
    const clientPays = subtotal * 1.20

    // Platform takes 35% of base rate
    const platformFee = subtotal * 0.35

    // CPO receives 85% of base rate (base - 15% platform fee)
    const cpoReceives = subtotal * 0.85

    const response: FeeCalculationResponse = {
      baseRate,
      hours,
      subtotal,
      clientPays,
      platformFee,
      cpoReceives,
      breakdown: {
        clientMarkup: 0.20, // 20%
        platformFeePercentage: 0.35, // 35% of base
        cpoPercentage: 0.85, // 85% of base
      },
    }

    // Log the calculation for audit purposes
    await supabaseClient.from('fee_calculations').insert({
      user_id: user.id,
      protection_level: protectionLevel,
      base_rate: baseRate,
      hours,
      subtotal,
      client_pays: clientPays,
      platform_fee: platformFee,
      cpo_receives: cpoReceives,
      calculated_at: new Date().toISOString(),
    })

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error calculating marketplace fees:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
