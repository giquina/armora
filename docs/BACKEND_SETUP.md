# BACKEND SETUP GUIDE

## Overview

Armora uses **Supabase** as the backend database and authentication service. The database schema is designed with **SIA compliance** and **protection-focused terminology**.

## Environment Configuration

### Required Environment Variables

Create `.env.local` in the project root with:

```bash
# Supabase Configuration - Armora Protection Service
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# React App versions (for CRA compatibility)
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Security Configuration
REACT_APP_SIA_VERIFICATION_REQUIRED=true
REACT_APP_PANIC_BUTTON_ENABLED=true
REACT_APP_ENABLE_MARTYNS_LAW=true
```

## Database Schema

### Core Tables

#### 1. `profiles` (User Profiles)
```sql
- id: uuid (primary key, references auth.users)
- full_name: text
- phone_number: text
- emergency_contacts: jsonb
- user_type: enum ('principal', 'protection_officer')
- subscription_tier: enum ('free', 'premium')
- created_at: timestamp
- updated_at: timestamp
```

#### 2. `protection_officers` (CPO Details)
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- sia_license_number: text (unique)
- sia_license_expiry: date
- protection_level: text[] ('essential', 'executive', 'shadow')
- vehicle_make_model: text
- vehicle_registration: text
- availability_status: enum ('available', 'busy', 'offline')
- current_location: point (PostGIS)
- coverage_areas: text[]
- average_rating: decimal
- total_assignments: integer
- specializations: text[]
- active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### 3. `protection_assignments` (Core Service Records)
```sql
- id: uuid (primary key)
- principal_id: uuid (references profiles)
- officer_id: uuid (references protection_officers)
- assignment_status: enum ('requested', 'confirmed', 'in_progress', 'completed', 'cancelled')
- protection_level: enum ('essential', 'executive', 'shadow')
- commencement_point: jsonb (location details)
- secure_destination: jsonb (location details)
- scheduled_time: timestamp
- actual_start_time: timestamp
- actual_end_time: timestamp
- service_fee: decimal
- distance_miles: decimal
- protection_duration_minutes: integer
- security_notes: text
- threat_assessment: enum ('low', 'medium', high')
- route_data: jsonb
- created_at: timestamp
- updated_at: timestamp
```

#### 4. `payment_transactions` (Financial Records)
```sql
- id: uuid (primary key)
- assignment_id: uuid (references protection_assignments)
- principal_id: uuid (references profiles)
- payment_status: enum ('pending', 'completed', 'failed', 'refunded')
- service_fee: decimal
- stripe_payment_intent_id: text
- payment_method: enum ('card', 'apple_pay', 'google_pay', 'bank_transfer')
- payment_metadata: jsonb
- processed_at: timestamp
- created_at: timestamp
- updated_at: timestamp
```

#### 5. `emergency_activations` (Panic Button)
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- assignment_id: uuid (references protection_assignments, nullable)
- activation_type: enum ('panic_button', 'threat_detected', 'medical_emergency')
- location: point (PostGIS)
- response_status: enum ('activated', 'responding', 'resolved')
- activated_at: timestamp
- resolved_at: timestamp
- response_details: jsonb
```

#### 6. `questionnaire_responses` (Client Assessment)
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- responses: jsonb
- privacy_preferences: jsonb
- threat_assessment_score: integer
- recommended_protection_level: text
- completed: boolean
- completed_at: timestamp
- updated_at: timestamp
```

#### 7. `protection_reviews` (Service Feedback)
```sql
- id: uuid (primary key)
- assignment_id: uuid (references protection_assignments)
- officer_id: uuid (references protection_officers)
- principal_id: uuid (references profiles)
- rating: integer (1-5)
- security_rating: integer (1-5)
- professionalism_rating: integer (1-5)
- communication_rating: integer (1-5)
- review_text: text
- created_at: timestamp
```

### Supporting Tables

#### `venue_protection_contracts`
```sql
- id: uuid (primary key)
- client_id: uuid (references profiles)
- venue_name: text
- venue_address: jsonb
- contract_type: enum ('day', 'weekend', 'monthly', 'annual')
- officer_count: integer
- protection_level: enum ('essential', 'executive', 'shadow')
- contract_fee: decimal
- start_date: date
- end_date: date
- status: enum ('active', 'pending', 'cancelled', 'completed')
```

#### `safe_assignment_fund_contributions`
```sql
- id: uuid (primary key)
- user_id: uuid (references profiles)
- assignment_id: uuid (references protection_assignments, nullable)
- contribution_amount: decimal
- contribution_type: enum ('voluntary', 'automatic_roundup')
- created_at: timestamp
```

#### `sia_license_verifications`
```sql
- id: uuid (primary key)
- license_number: text (unique)
- officer_name: text
- license_type: text
- issued_date: date
- expiry_date: date
- status: enum ('valid', 'expired', 'suspended', 'revoked')
- verification_date: timestamp
- verified_by: text
```

## API Endpoints

All API endpoints use **protection terminology**:

### Protection Assignment Endpoints
```
POST   /api/protection/request           # Create new protection assignment
GET    /api/assignments/{id}             # Get assignment details
PUT    /api/assignments/{id}             # Update assignment
DELETE /api/assignments/{id}/cancel      # Cancel assignment
GET    /api/protection/history           # Get user's assignment history
```

### Officer Management
```
GET    /api/officers/available           # Find available officers
GET    /api/officers/{id}                # Get officer details
PUT    /api/officers/{id}/status         # Update officer status
POST   /api/officers/{id}/location       # Update officer location
GET    /api/officers/{id}/reviews        # Get officer reviews
```

### Emergency Services
```
POST   /api/emergency/activate           # Activate panic button
PUT    /api/emergency/{id}/resolve       # Resolve emergency
GET    /api/emergency/status             # Get emergency status
```

### Payment Integration
```
POST   /api/payments/create-intent       # Create Stripe payment intent
POST   /api/payments/confirm             # Confirm payment
GET    /api/payments/history             # Get payment history
POST   /api/payments/refund              # Process refund
```

## Client Configuration

### Primary Client (`src/lib/supabase.ts`)
- Handles authentication and main database operations
- Uses protection-compliant function names
- Includes real-time subscriptions for assignments
- Emergency activation functions

### Utility Client (`src/utils/supabaseClient.ts`)
- Lightweight client for utility operations
- Backward compatibility support

## Real-time Features

### Assignment Tracking
```typescript
// Subscribe to assignment updates
const subscription = supabase
  .channel(`assignment-${assignmentId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'protection_assignments',
    filter: `id=eq.${assignmentId}`
  }, (payload) => {
    // Handle real-time updates
  })
  .subscribe()
```

### Officer Location Tracking
```typescript
// Subscribe to officer location updates
const locationSubscription = supabase
  .channel(`officer-location-${officerId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'protection_officers',
    filter: `id=eq.${officerId}`
  }, (payload) => {
    // Update officer location
  })
  .subscribe()
```

## Security Configuration

### Row Level Security (RLS)

All tables use RLS policies:

```sql
-- Profiles: Users can only access their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Protection assignments: Principals see their assignments, Officers see theirs
CREATE POLICY "Principals can view own assignments" ON protection_assignments
  FOR SELECT USING (auth.uid() = principal_id);

CREATE POLICY "Officers can view assigned assignments" ON protection_assignments
  FOR SELECT USING (auth.uid() = officer_id);
```

### API Security

- Supabase handles authentication automatically
- Service role key used for admin operations only
- Anon key used for client-side operations
- All sensitive operations require authentication

## Database Functions

### PostGIS Functions for Location Services

```sql
-- Find nearby officers within radius
CREATE OR REPLACE FUNCTION find_nearby_officers(
  lat FLOAT,
  lng FLOAT,
  radius_km FLOAT DEFAULT 10
) RETURNS TABLE (
  id UUID,
  full_name TEXT,
  distance_km FLOAT,
  protection_level TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    po.id,
    p.full_name,
    ST_Distance(
      ST_MakePoint(lng, lat)::geography,
      po.current_location::geography
    ) / 1000 AS distance_km,
    po.protection_level
  FROM protection_officers po
  JOIN profiles p ON p.id = po.user_id
  WHERE po.availability_status = 'available'
    AND po.active = true
    AND ST_DWithin(
      ST_MakePoint(lng, lat)::geography,
      po.current_location::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

## Testing the Connection

### Basic Connection Test
```typescript
import { supabase } from './src/lib/supabase'

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('protection_assignments')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Connection failed:', error)
    } else {
      console.log('Connected successfully:', data)
    }
  } catch (err) {
    console.error('Test failed:', err)
  }
}

testConnection()
```

## Migration Setup

Create `supabase/migrations/` folder with:

1. `001_initial_protection_schema.sql` - Core tables
2. `002_rls_policies.sql` - Security policies
3. `003_functions.sql` - Database functions
4. `004_triggers.sql` - Automated triggers

## Environment-Specific Configuration

### Development
- Uses `.env.local` for local development
- Real Supabase project for consistent testing
- Development mode shows additional debug info

### Production
- Environment variables in deployment platform
- Same Supabase project (different API keys)
- Enhanced security and monitoring

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check environment variables
   - Verify Supabase project URL and keys
   - Check network connectivity

2. **RLS Policy Errors**
   - Ensure user is authenticated
   - Check policy conditions
   - Verify user roles and permissions

3. **Real-time Not Working**
   - Check subscription setup
   - Verify table permissions
   - Ensure proper cleanup of subscriptions

### Debug Commands

```typescript
// Check current user
const user = await supabase.auth.getUser()
console.log('Current user:', user)

// Test specific table access
const { data, error } = await supabase
  .from('protection_assignments')
  .select('count')
console.log('Assignment count:', data, error)
```

---

**Last Updated:** September 2025
**Status:** Production Ready
**SIA Compliance:** ✅ Verified