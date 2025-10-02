import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EarningsRequest {
  cpoId?: string // Optional - if not provided, uses authenticated user
  period: 'week' | 'month' | 'year' | 'all'
  startDate?: string
  endDate?: string
}

interface Payout {
  id: string
  assignment_id: string
  amount: number
  currency: string
  status: string
  processed_at: string
  stripe_transfer_id: string
}

interface EarningsResponse {
  cpoId: string
  period: string
  totalEarnings: number
  totalPayouts: number
  pendingEarnings: number
  pendingPayouts: number
  currency: string
  payouts: Payout[]
  dateRange: {
    start: string
    end: string
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
    const { cpoId, period, startDate, endDate }: EarningsRequest = await req.json()

    // Determine which CPO's earnings to query
    let targetCpoId = cpoId || user.id

    // Verify user has permission to view these earnings
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Users can only view their own earnings unless they're admin
    if (targetCpoId !== user.id && profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Cannot view other CPO earnings' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate date range based on period
    const now = new Date()
    let start: Date
    let end: Date = now

    if (startDate && endDate) {
      start = new Date(startDate)
      end = new Date(endDate)
    } else {
      switch (period) {
        case 'week':
          start = new Date(now)
          start.setDate(now.getDate() - 7)
          break
        case 'month':
          start = new Date(now)
          start.setMonth(now.getMonth() - 1)
          break
        case 'year':
          start = new Date(now)
          start.setFullYear(now.getFullYear() - 1)
          break
        case 'all':
        default:
          start = new Date('2020-01-01') // Beginning of service
          break
      }
    }

    // Query completed payouts
    const { data: completedPayouts, error: payoutsError } = await supabaseClient
      .from('cpo_payouts')
      .select('*')
      .eq('cpo_id', targetCpoId)
      .eq('status', 'completed')
      .gte('processed_at', start.toISOString())
      .lte('processed_at', end.toISOString())
      .order('processed_at', { ascending: false })

    if (payoutsError) {
      throw new Error(`Error fetching payouts: ${payoutsError.message}`)
    }

    // Calculate total earnings from completed payouts
    const totalEarnings = completedPayouts?.reduce((sum, payout) => sum + (payout.amount || 0), 0) || 0
    const totalPayouts = completedPayouts?.length || 0

    // Query pending earnings (completed assignments not yet paid out)
    const { data: pendingAssignments, error: pendingError } = await supabaseClient
      .from('protection_assignments')
      .select('cpo_amount, id')
      .eq('cpo_id', targetCpoId)
      .eq('status', 'completed')
      .eq('payment_status', 'succeeded')
      .or('payout_status.is.null,payout_status.eq.pending')
      .gte('completed_at', start.toISOString())
      .lte('completed_at', end.toISOString())

    if (pendingError) {
      throw new Error(`Error fetching pending assignments: ${pendingError.message}`)
    }

    const pendingEarnings = pendingAssignments?.reduce((sum, assignment) => sum + (assignment.cpo_amount || 0), 0) || 0
    const pendingPayouts = pendingAssignments?.length || 0

    const response: EarningsResponse = {
      cpoId: targetCpoId,
      period,
      totalEarnings,
      totalPayouts,
      pendingEarnings,
      pendingPayouts,
      currency: 'GBP',
      payouts: completedPayouts || [],
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    }

    return new Response(
      JSON.stringify(response),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error fetching CPO earnings:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
