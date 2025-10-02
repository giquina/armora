import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FindCPOsRequest {
  latitude: number
  longitude: number
  protectionLevel: 'essential' | 'executive' | 'shadow_protocol' | 'client_vehicle'
  startTime: string
  endTime: string
  maxDistance?: number // km, default 50
  minRating?: number // 0-5, default 4.0
}

interface CPOMatch {
  id: string
  full_name: string
  profile_image_url: string | null
  rating: number
  total_assignments: number
  protection_levels: string[]
  sia_license_number: string
  sia_license_expiry: string
  distance_km: number
  hourly_rate: number
  availability_status: string
  vehicle_type?: string
  certifications: string[]
}

interface FindCPOsResponse {
  totalMatches: number
  cpos: CPOMatch[]
  searchCriteria: {
    location: { latitude: number; longitude: number }
    protectionLevel: string
    timeRange: { start: string; end: string }
    maxDistance: number
    minRating: number
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
    const {
      latitude,
      longitude,
      protectionLevel,
      startTime,
      endTime,
      maxDistance = 50,
      minRating = 4.0,
    }: FindCPOsRequest = await req.json()

    // Validate inputs
    if (!latitude || !longitude || !protectionLevel || !startTime || !endTime) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({ error: 'Invalid coordinates' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Call the database function to find available CPOs
    // This uses PostGIS for geographic calculations
    const { data: availableCPOs, error: searchError } = await supabaseClient.rpc(
      'find_available_cpos',
      {
        search_lat: latitude,
        search_lng: longitude,
        protection_level: protectionLevel,
        start_time: startTime,
        end_time: endTime,
        max_distance_km: maxDistance,
        min_rating: minRating,
      }
    )

    if (searchError) {
      console.error('Database search error:', searchError)

      // Fallback to basic query if RPC function doesn't exist yet
      const { data: cpos, error: fallbackError } = await supabaseClient
        .from('profiles')
        .select(`
          id,
          full_name,
          profile_image_url,
          rating,
          total_assignments,
          protection_levels,
          sia_license_number,
          sia_license_expiry,
          hourly_rate,
          availability_status,
          vehicle_type,
          certifications,
          current_latitude,
          current_longitude
        `)
        .eq('role', 'protection_officer')
        .eq('availability_status', 'available')
        .contains('protection_levels', [protectionLevel])
        .gte('rating', minRating)
        .gte('sia_license_expiry', new Date().toISOString())
        .order('rating', { ascending: false })

      if (fallbackError) {
        throw new Error(`Error finding CPOs: ${fallbackError.message}`)
      }

      // Calculate distances manually using Haversine formula
      const cposWithDistance = (cpos || []).map((cpo: any) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          cpo.current_latitude || 0,
          cpo.current_longitude || 0
        )
        return {
          ...cpo,
          distance_km: distance,
        }
      })

      // Filter by distance and sort
      const filteredCPOs = cposWithDistance
        .filter((cpo: any) => cpo.distance_km <= maxDistance)
        .sort((a: any, b: any) => {
          // Sort by rating first, then by distance
          if (Math.abs(a.rating - b.rating) > 0.1) {
            return b.rating - a.rating
          }
          return a.distance_km - b.distance_km
        })

      const response: FindCPOsResponse = {
        totalMatches: filteredCPOs.length,
        cpos: filteredCPOs,
        searchCriteria: {
          location: { latitude, longitude },
          protectionLevel,
          timeRange: { start: startTime, end: endTime },
          maxDistance,
          minRating,
        },
      }

      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Return results from RPC function
    const response: FindCPOsResponse = {
      totalMatches: availableCPOs?.length || 0,
      cpos: availableCPOs || [],
      searchCriteria: {
        location: { latitude, longitude },
        protectionLevel,
        timeRange: { start: startTime, end: endTime },
        maxDistance,
        minRating,
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
    console.error('Error finding available CPOs:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Haversine formula to calculate distance between two points
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
