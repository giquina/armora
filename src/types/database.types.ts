// Database type definitions for Armora Protection Services
// Generated from Supabase schema with protection service terminology

export interface Database {
  public: {
    Tables: {
      protection_officers: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          full_name: string
          sia_license: string
          protection_level: string[]
          vehicle_details: any
          status: 'pending_approval' | 'approved' | 'suspended' | 'inactive'
          availability_status: 'available' | 'on_assignment' | 'offline' | 'busy'
          current_location: any
          coverage_areas: string[]
          rating: number
          total_assignments: number
          specializations: string[]
          background_check_expires: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          full_name: string
          sia_license: string
          protection_level?: string[]
          vehicle_details?: any
          status?: 'pending_approval' | 'approved' | 'suspended' | 'inactive'
          availability_status?: 'available' | 'on_assignment' | 'offline' | 'busy'
          current_location?: any
          coverage_areas?: string[]
          rating?: number
          total_assignments?: number
          specializations?: string[]
          background_check_expires?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          full_name?: string
          sia_license?: string
          protection_level?: string[]
          vehicle_details?: any
          status?: 'pending_approval' | 'approved' | 'suspended' | 'inactive'
          availability_status?: 'available' | 'on_assignment' | 'offline' | 'busy'
          current_location?: any
          coverage_areas?: string[]
          rating?: number
          total_assignments?: number
          specializations?: string[]
          background_check_expires?: string
          updated_at?: string
        }
      }
      principals: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          full_name: string
          phone: string | null
          discount_percentage: number
          questionnaire_completed: boolean
          questionnaire_data: any
          preferred_protection_level: string | null
          emergency_contacts: any
          accessibility_requirements: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          full_name: string
          phone?: string
          discount_percentage?: number
          questionnaire_completed?: boolean
          questionnaire_data?: any
          preferred_protection_level?: string
          emergency_contacts?: any
          accessibility_requirements?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          full_name?: string
          phone?: string
          discount_percentage?: number
          questionnaire_completed?: boolean
          questionnaire_data?: any
          preferred_protection_level?: string
          emergency_contacts?: any
          accessibility_requirements?: string
          updated_at?: string
        }
      }
      protection_assignments: {
        Row: {
          id: string
          principal_id: string
          officer_id: string | null
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          protection_level: 'essential' | 'executive' | 'shadow'
          commencement_point: any
          secure_destination: any
          scheduled_start: string
          actual_start: string | null
          actual_end: string | null
          service_fee: number
          distance_miles: number | null
          duration_minutes: number | null
          special_requirements: string | null
          officer_notes: string | null
          principal_rating: number | null
          officer_rating: number | null
          assignment_metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          principal_id: string
          officer_id?: string
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          protection_level: 'essential' | 'executive' | 'shadow'
          commencement_point: any
          secure_destination: any
          scheduled_start: string
          actual_start?: string
          actual_end?: string
          service_fee: number
          distance_miles?: number
          duration_minutes?: number
          special_requirements?: string
          officer_notes?: string
          principal_rating?: number
          officer_rating?: number
          assignment_metadata?: any
        }
        Update: {
          id?: string
          principal_id?: string
          officer_id?: string
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          protection_level?: 'essential' | 'executive' | 'shadow'
          commencement_point?: any
          secure_destination?: any
          scheduled_start?: string
          actual_start?: string
          actual_end?: string
          service_fee?: number
          distance_miles?: number
          duration_minutes?: number
          special_requirements?: string
          officer_notes?: string
          principal_rating?: number
          officer_rating?: number
          assignment_metadata?: any
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          assignment_id: string
          principal_id: string
          amount: number
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          stripe_payment_id: string | null
          stripe_payment_intent_id: string | null
          refund_amount: number | null
          refund_reason: string | null
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          principal_id: string
          amount: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          payment_method?: string
          stripe_payment_id?: string
          stripe_payment_intent_id?: string
          refund_amount?: number
          refund_reason?: string
          processed_at?: string
        }
        Update: {
          id?: string
          assignment_id?: string
          principal_id?: string
          amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
          payment_method?: string
          stripe_payment_id?: string
          stripe_payment_intent_id?: string
          refund_amount?: number
          refund_reason?: string
          processed_at?: string
        }
      }
      questionnaire_responses: {
        Row: {
          id: string
          user_id: string | null
          clerk_user_id: string | null
          responses: any
          completed: boolean
          completion_percentage: number
          profile_type: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          clerk_user_id?: string
          responses: any
          completed?: boolean
          completion_percentage?: number
          profile_type?: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clerk_user_id?: string
          responses?: any
          completed?: boolean
          completion_percentage?: number
          profile_type?: string
          completed_at?: string
          updated_at?: string
        }
      }
      protection_reviews: {
        Row: {
          id: string
          assignment_id: string
          principal_id: string
          officer_id: string
          rating: number
          review_text: string | null
          service_aspects: any
          created_at: string
        }
        Insert: {
          id?: string
          assignment_id: string
          principal_id: string
          officer_id: string
          rating: number
          review_text?: string
          service_aspects?: any
        }
        Update: {
          id?: string
          assignment_id?: string
          principal_id?: string
          officer_id?: string
          rating?: number
          review_text?: string
          service_aspects?: any
        }
      }
      emergency_activations: {
        Row: {
          id: string
          user_id: string | null
          assignment_id: string | null
          activation_type: 'panic_button' | 'medical' | 'security_threat' | 'breakdown'
          location: any
          response_status: 'activated' | 'dispatched' | 'resolved' | 'false_alarm'
          response_time_seconds: number | null
          resolution_notes: string | null
          activated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string
          assignment_id?: string
          activation_type: 'panic_button' | 'medical' | 'security_threat' | 'breakdown'
          location: any
          response_status?: 'activated' | 'dispatched' | 'resolved' | 'false_alarm'
          response_time_seconds?: number
          resolution_notes?: string
          activated_at?: string
          resolved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assignment_id?: string
          activation_type?: 'panic_button' | 'medical' | 'security_threat' | 'breakdown'
          location?: any
          response_status?: 'activated' | 'dispatched' | 'resolved' | 'false_alarm'
          response_time_seconds?: number
          resolution_notes?: string
          activated_at?: string
          resolved_at?: string
        }
      }
      venue_protection_contracts: {
        Row: {
          id: string
          client_id: string
          venue_name: string
          venue_address: any
          contract_type: 'day' | 'weekend' | 'monthly' | 'annual'
          officer_count: number
          protection_level: 'essential' | 'executive' | 'shadow'
          contract_value: number
          start_date: string
          end_date: string
          special_requirements: string | null
          status: 'active' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          venue_name: string
          venue_address: any
          contract_type: 'day' | 'weekend' | 'monthly' | 'annual'
          officer_count?: number
          protection_level: 'essential' | 'executive' | 'shadow'
          contract_value: number
          start_date: string
          end_date: string
          special_requirements?: string
          status?: 'active' | 'completed' | 'cancelled'
        }
        Update: {
          id?: string
          client_id?: string
          venue_name?: string
          venue_address?: any
          contract_type?: 'day' | 'weekend' | 'monthly' | 'annual'
          officer_count?: number
          protection_level?: 'essential' | 'executive' | 'shadow'
          contract_value?: number
          start_date?: string
          end_date?: string
          special_requirements?: string
          status?: 'active' | 'completed' | 'cancelled'
        }
      }
      safe_ride_fund_contributions: {
        Row: {
          id: string
          contributor_id: string | null
          assignment_id: string | null
          contribution_amount: number
          contribution_type: 'assignment_percentage' | 'direct_donation' | 'subscription_bonus' | null
          created_at: string
        }
        Insert: {
          id?: string
          contributor_id?: string
          assignment_id?: string
          contribution_amount: number
          contribution_type?: 'assignment_percentage' | 'direct_donation' | 'subscription_bonus'
        }
        Update: {
          id?: string
          contributor_id?: string
          assignment_id?: string
          contribution_amount?: number
          contribution_type?: 'assignment_percentage' | 'direct_donation' | 'subscription_bonus'
        }
      }
      safe_ride_fund_stats: {
        Row: {
          id: string
          total_safe_assignments: number
          total_contributions: number
          monthly_target: number
          last_updated: string
        }
        Insert: {
          id?: string
          total_safe_assignments?: number
          total_contributions?: number
          monthly_target?: number
          last_updated?: string
        }
        Update: {
          id?: string
          total_safe_assignments?: number
          total_contributions?: number
          monthly_target?: number
          last_updated?: string
        }
      }
      sia_license_verifications: {
        Row: {
          id: string
          license_number: string
          holder_name: string
          license_type: string
          issue_date: string
          expiry_date: string
          status: 'active' | 'expired' | 'suspended' | 'revoked'
          verification_date: string
        }
        Insert: {
          id?: string
          license_number: string
          holder_name: string
          license_type: string
          issue_date: string
          expiry_date: string
          status?: 'active' | 'expired' | 'suspended' | 'revoked'
          verification_date?: string
        }
        Update: {
          id?: string
          license_number?: string
          holder_name?: string
          license_type?: string
          issue_date?: string
          expiry_date?: string
          status?: 'active' | 'expired' | 'suspended' | 'revoked'
          verification_date?: string
        }
      }
    }
    Functions: {
      find_nearby_officers: {
        Args: {
          lat: number
          lng: number
          radius_km?: number
        }
        Returns: {
          id: string
          full_name: string
          protection_level: string[]
          rating: number
          distance_km: number
        }[]
      }
    }
  }
}

// Helper types for common operations
export type ProtectionOfficer = Database['public']['Tables']['protection_officers']['Row']
export type Principal = Database['public']['Tables']['principals']['Row']
export type ProtectionAssignment = Database['public']['Tables']['protection_assignments']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type EmergencyActivation = Database['public']['Tables']['emergency_activations']['Row']
export type VenueProtectionContract = Database['public']['Tables']['venue_protection_contracts']['Row']

// Insert types for form handling
export type NewProtectionOfficer = Database['public']['Tables']['protection_officers']['Insert']
export type NewPrincipal = Database['public']['Tables']['principals']['Insert']
export type NewProtectionAssignment = Database['public']['Tables']['protection_assignments']['Insert']
export type NewPayment = Database['public']['Tables']['payments']['Insert']

// Commonly used enums
export type ProtectionLevel = 'essential' | 'executive' | 'shadow'
export type AssignmentStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
export type OfficerStatus = 'pending_approval' | 'approved' | 'suspended' | 'inactive'
export type AvailabilityStatus = 'available' | 'on_assignment' | 'offline' | 'busy'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'