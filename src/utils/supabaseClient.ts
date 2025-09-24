import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env.local file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'armora-supabase-auth',
  },
  global: {
    headers: {
      'X-Client-Info': 'armora-security-app',
    },
  },
})

// Named export
export { supabase as supabaseClient }

// Default export for backward compatibility
export default supabase