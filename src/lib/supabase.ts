import { createClient } from '@supabase/supabase-js'

// Supabase configuration for Armora Protection Service
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create Supabase client with auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    headers: {
      'x-application-name': 'armora-protection-service',
    },
  },
})

// Auth helper functions
export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
}

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard',
    },
  })
}

export const signOut = async () => {
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Protection service specific queries
export const getProtectionOfficers = async (location?: string) => {
  let query = supabase
    .from('protection_officers')
    .select('*')
    .eq('availability_status', 'available')
    .eq('active', true)

  if (location) {
    query = query.contains('coverage_areas', [location])
  }

  return await query
}

export const createProtectionAssignment = async (assignmentData: any) => {
  return await supabase
    .from('protection_assignments')
    .insert(assignmentData)
    .select()
    .single()
}

export const getProtectionAssignment = async (assignmentId: string) => {
  return await supabase
    .from('protection_assignments')
    .select(`
      *,
      protection_officers (
        full_name,
        sia_license_number,
        protection_level,
        vehicle_make_model,
        average_rating
      ),
      profiles (
        full_name,
        phone_number,
        emergency_contacts
      )
    `)
    .eq('id', assignmentId)
    .single()
}

export const updateProtectionAssignment = async (assignmentId: string, updates: any) => {
  return await supabase
    .from('protection_assignments')
    .update(updates)
    .eq('id', assignmentId)
    .select()
    .single()
}

export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export const updateUserProfile = async (userId: string, updates: any) => {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
}

export const getUserAssignments = async (userId: string) => {
  return await supabase
    .from('protection_assignments')
    .select(`
      *,
      protection_officers (
        full_name,
        sia_license_number,
        average_rating
      )
    `)
    .eq('principal_id', userId)
    .order('created_at', { ascending: false })
}

// Real-time subscriptions
export const subscribeToAssignmentUpdates = (assignmentId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`assignment-${assignmentId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'protection_assignments',
        filter: `id=eq.${assignmentId}`,
      },
      callback
    )
    .subscribe()
}

export const subscribeToOfficerLocation = (officerId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`officer-location-${officerId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'protection_officers',
        filter: `id=eq.${officerId}`,
      },
      callback
    )
    .subscribe()
}

// Emergency activation
export const activateEmergency = async (userId: string, location: any, assignmentId?: string) => {
  return await supabase
    .from('emergency_activations')
    .insert({
      user_id: userId,
      assignment_id: assignmentId,
      activation_type: 'panic_button',
      location: location,
      response_status: 'activated',
      activated_at: new Date().toISOString(),
    })
    .select()
    .single()
}

export const deactivateEmergency = async (emergencyId: string) => {
  return await supabase
    .from('emergency_activations')
    .update({
      response_status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', emergencyId)
    .select()
    .single()
}

// Payment operations
export const createPaymentTransaction = async (transactionData: any) => {
  return await supabase
    .from('payment_transactions')
    .insert(transactionData)
    .select()
    .single()
}

export const updatePaymentStatus = async (transactionId: string, status: string, metadata?: any) => {
  return await supabase
    .from('payment_transactions')
    .update({
      payment_status: status,
      payment_metadata: metadata,
      updated_at: new Date().toISOString(),
    })
    .eq('id', transactionId)
    .select()
    .single()
}

// Questionnaire responses
export const saveQuestionnaireResponse = async (userId: string, responses: any) => {
  return await supabase
    .from('questionnaire_responses')
    .upsert({
      user_id: userId,
      responses: responses,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
}

export const getQuestionnaireResponse = async (userId: string) => {
  return await supabase
    .from('questionnaire_responses')
    .select('*')
    .eq('user_id', userId)
    .single()
}

// Protection reviews
export const createProtectionReview = async (reviewData: any) => {
  return await supabase
    .from('protection_reviews')
    .insert(reviewData)
    .select()
    .single()
}

export const getOfficerReviews = async (officerId: string) => {
  return await supabase
    .from('protection_reviews')
    .select(`
      *,
      profiles (
        full_name
      )
    `)
    .eq('officer_id', officerId)
    .order('created_at', { ascending: false })
}

// Venue protection services
export const createVenueProtectionContract = async (contractData: any) => {
  return await supabase
    .from('venue_protection_contracts')
    .insert(contractData)
    .select()
    .single()
}

export const getVenueProtectionContracts = async (userId: string) => {
  return await supabase
    .from('venue_protection_contracts')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false })
}

// Analytics and reporting
export const getAssignmentAnalytics = async (userId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('protection_assignments')
    .select('*')
    .eq('principal_id', userId)
    .eq('assignment_status', 'completed')

  if (startDate) {
    query = query.gte('completed_at', startDate)
  }

  if (endDate) {
    query = query.lte('completed_at', endDate)
  }

  return await query
}

// Safe Assignment Fund operations
export const recordSafeAssignmentFundContribution = async (contributionData: any) => {
  return await supabase
    .from('safe_ride_fund_contributions')
    .insert(contributionData)
    .select()
    .single()
}

export const getSafeAssignmentFundStats = async () => {
  return await supabase
    .from('safe_ride_fund_stats')
    .select('*')
    .single()
}

// SIA license verification
export const verifySIALicense = async (licenseNumber: string) => {
  return await supabase
    .from('sia_license_verifications')
    .select('*')
    .eq('license_number', licenseNumber)
    .single()
}

// Officer availability management
export const updateOfficerAvailability = async (officerId: string, status: string, location?: any) => {
  const updates: any = {
    availability_status: status,
    updated_at: new Date().toISOString(),
  }

  if (location) {
    updates.current_location = location
  }

  return await supabase
    .from('protection_officers')
    .update(updates)
    .eq('id', officerId)
    .select()
    .single()
}

// Search for nearby protection officers
export const findNearbyOfficers = async (lat: number, lng: number, radiusKm: number = 10, protectionLevel?: string) => {
  // Using PostGIS ST_DWithin for geographic proximity search
  let query = supabase.rpc('find_nearby_officers', {
    lat,
    lng,
    radius_km: radiusKm,
  })

  if (protectionLevel) {
    query = query.eq('protection_level', protectionLevel)
  }

  return await query
}

export default supabase