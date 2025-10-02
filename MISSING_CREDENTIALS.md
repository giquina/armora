# Missing Credentials & Manual Setup Required

This document lists environment variables that need to be obtained manually and set up.

## 🔴 CRITICAL - Required for Production

### 1. Stripe Webhook Secret

**Current Status:** Placeholder value `whsec_placeholder`

**How to obtain:**

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter webhook URL: `https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/stripe-webhook`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Save the endpoint
6. Copy the "Signing secret" (starts with `whsec_`)
7. Set in Supabase:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
   ```

**Where to set:**
- `/workspaces/armora/supabase/functions/.env` (local testing)
- Supabase Edge Function secrets (production)

### 2. Google Maps API Key

**Current Status:** Placeholder value `placeholder_google_maps_key`

**How to obtain:**

1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing "Armora Protection"
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Directions API
4. Go to Credentials: https://console.cloud.google.com/google/maps-apis/credentials
5. Create API Key (or use existing)
6. Restrict the API key:
   - Application restrictions: HTTP referrers
   - Website restrictions:
     - `https://armora.vercel.app/*`
     - `http://localhost:3000/*` (for development)
   - API restrictions: Select the 4 APIs listed above
7. Copy the API key

**Where to set:**
- `/workspaces/armora/.env.local` → `REACT_APP_GOOGLE_MAPS_API_KEY`
- `/workspaces/armora-cpo/.env.local` → `REACT_APP_GOOGLE_MAPS_API_KEY` (if CPO app needs maps)
- Vercel environment variables (production)

### 3. Firebase VAPID Key

**Current Status:** Missing in both apps

**How to obtain:**

1. Go to Firebase Console: https://console.firebase.google.com/project/armora-protection
2. Navigate to: Project Settings → Cloud Messaging
3. Scroll to "Web Push certificates"
4. If no certificate exists, click "Generate key pair"
5. Copy the "Key pair" value

**Where to set:**
- `/workspaces/armora/.env.local` → `REACT_APP_FIREBASE_VAPID_KEY`
- `/workspaces/armora-cpo/.env.local` → `REACT_APP_FIREBASE_VAPID_KEY`
- Vercel environment variables (production)

## 🟡 IMPORTANT - Recommended for Security

### 4. Firebase Storage Bucket (Incorrect Value)

**Current Status:** `armora-protection.firebasestorage.app`
**Correct Value:** Should be `armora-protection.appspot.com`

**How to verify:**

1. Go to Firebase Console: https://console.firebase.google.com/project/armora-protection/settings/general
2. Check the "Storage bucket" field
3. Update `.env.local` files if different

**Where to update:**
- `/workspaces/armora/.env.local` → `REACT_APP_FIREBASE_STORAGE_BUCKET`
- Vercel environment variables (production)

### 5. Remove STRIPE_SECRET_KEY from Frontend

**Current Status:** Present in `/workspaces/armora/.env.local` (SECURITY RISK)

**Action Required:**

The `STRIPE_SECRET_KEY` should NEVER be in the frontend app. It's only needed in Edge Functions.

1. Remove from `/workspaces/armora/.env.local`:
   ```bash
   # Remove this line:
   STRIPE_SECRET_KEY=sk_test_...
   ```

2. Ensure it's set in Supabase Edge Functions:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY_HERE
   ```

3. Update `/workspaces/armora/src/services/stripePaymentService.ts`:
   - Line 10 declares `STRIPE_SECRET_KEY` but doesn't use it
   - Can be safely removed (service uses Edge Functions, not direct Stripe API)

## 🟢 OPTIONAL - Nice to Have

### 6. Clerk Configuration (Legacy)

**Current Status:** Present in `.env.local` but not actively used

**Note:** The app has migrated from Clerk to Supabase Auth. These variables can be removed:
- `REACT_APP_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

**Action:** Safe to remove from `.env.local` (not in `.env.example`)

## Checklist for Production Deployment

### Before deploying to production:

#### Stripe Configuration
- [ ] Create production webhook endpoint in Stripe
- [ ] Copy production webhook secret
- [ ] Set `STRIPE_WEBHOOK_SECRET` in Supabase (production)
- [ ] Update Stripe keys from test to live mode
- [ ] Test webhook with Stripe CLI: `stripe listen --forward-to https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`

#### Google Maps Configuration
- [ ] Obtain Google Maps API key
- [ ] Enable required APIs (Maps, Geocoding, Places, Directions)
- [ ] Set API key restrictions (HTTP referrers)
- [ ] Add to Vercel environment variables
- [ ] Test geocoding and maps functionality

#### Firebase Configuration
- [ ] Generate VAPID key for web push
- [ ] Verify storage bucket name
- [ ] Add VAPID key to Vercel environment variables
- [ ] Test push notifications on both apps

#### Security Audit
- [ ] Remove `STRIPE_SECRET_KEY` from frontend `.env.local`
- [ ] Remove legacy Clerk variables
- [ ] Verify all secrets are in Edge Functions, not frontend
- [ ] Ensure `.env.local` is in `.gitignore`
- [ ] Rotate any accidentally committed secrets

#### Supabase Edge Functions
- [ ] Deploy all Edge Functions to production
- [ ] Set all required secrets via Supabase CLI or Dashboard
- [ ] Test each function with production credentials
- [ ] Monitor function logs for errors

## Quick Setup Script

```bash
#!/bin/bash
# Run this after obtaining all credentials

# Principal App
cd /workspaces/armora
cp .env.example .env.local
# Edit .env.local with your credentials

# CPO App
cd /workspaces/armora-cpo
cp .env.example .env.local
# Edit .env.local with your credentials

# Supabase Edge Functions (Production)
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_KEY
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc_YOUR_KEY

# Deploy Edge Functions
supabase functions deploy create-payment-intent
supabase functions deploy confirm-payment
supabase functions deploy stripe-webhook
supabase functions deploy process-cpo-payout
supabase functions deploy get-cpo-earnings
supabase functions deploy calculate-marketplace-fees
supabase functions deploy find-available-cpos

echo "✅ Environment setup complete!"
```

## Support Contacts

- **Stripe Support:** https://support.stripe.com/
- **Google Cloud Support:** https://cloud.google.com/support
- **Firebase Support:** https://firebase.google.com/support
- **Supabase Support:** https://supabase.com/support
