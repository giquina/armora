# Environment Variables Setup Guide

This guide covers environment variable configuration for the Armora Protection Service platform, including the Principal app, CPO app, and Supabase Edge Functions.

## Quick Start

### 1. Principal App Setup

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual credentials
# See "Required Credentials" section below
```

### 2. CPO App Setup

```bash
cd /workspaces/armora-cpo

# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual credentials
# CPO app uses the same Supabase and Firebase projects as Principal app
```

### 3. Edge Functions Setup

```bash
# For local development, the .env file already exists at:
# /workspaces/armora/supabase/functions/.env

# For production, use Supabase secrets (see "Production Deployment" section)
```

## Required Credentials

### Supabase (Backend & Database)

**Where to get:** https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

| Variable | Used By | Description |
|----------|---------|-------------|
| `REACT_APP_SUPABASE_URL` | Principal App, CPO App | Project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Principal App, CPO App | Anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions | Service role key (admin access) |

**Important:**
- Principal and CPO apps MUST use the same Supabase project
- Service role key should NEVER be exposed in frontend apps
- Anon key is safe for client-side use (RLS policies protect data)

### Firebase (Push Notifications)

**Where to get:** https://console.firebase.google.com/project/armora-protection/settings/general

| Variable | Used By | Description |
|----------|---------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Principal App, CPO App | Firebase API key |
| `REACT_APP_FIREBASE_PROJECT_ID` | Principal App, CPO App | Project ID: `armora-protection` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Principal App, CPO App | Sender ID for FCM |
| `REACT_APP_FIREBASE_APP_ID` | Principal App, CPO App | App ID |
| `REACT_APP_FIREBASE_VAPID_KEY` | Principal App, CPO App | VAPID key for web push |

**Important:**
- Principal and CPO apps MUST use the same Firebase project
- VAPID key is found at: Firebase Console → Cloud Messaging → Web Push Certificates

### Stripe (Payments & Payouts)

**Where to get:** https://dashboard.stripe.com/test/apikeys

| Variable | Used By | Description |
|----------|---------|-------------|
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Principal App | Publishable key (test mode) |
| `STRIPE_SECRET_KEY` | Edge Functions | Secret key (NEVER expose in frontend) |
| `STRIPE_WEBHOOK_SECRET` | Edge Functions | Webhook signature secret |

**Important:**
- CPO app does NOT need Stripe keys (payments handled by Principal app)
- For webhooks, create endpoint at: https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook
- Get webhook secret after creating the endpoint in Stripe Dashboard

### Google Maps (Geocoding & Location)

**Where to get:** https://console.cloud.google.com/google/maps-apis/credentials

| Variable | Used By | Description |
|----------|---------|-------------|
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Principal App, CPO App (optional) | Maps API key |

## Edge Function Environment Variables

### Function-Specific Requirements

#### create-payment-intent
```
STRIPE_SECRET_KEY ✓ Required
SUPABASE_URL ✓ Required
SUPABASE_SERVICE_ROLE_KEY ✓ Required
```

#### confirm-payment
```
STRIPE_SECRET_KEY ✓ Required
SUPABASE_URL ✓ Required
SUPABASE_SERVICE_ROLE_KEY ✓ Required
```

#### stripe-webhook
```
STRIPE_SECRET_KEY ✓ Required
STRIPE_WEBHOOK_SECRET ✓ Required
SUPABASE_URL ✓ Required
SUPABASE_SERVICE_ROLE_KEY ✓ Required
```

#### process-cpo-payout
```
STRIPE_SECRET_KEY ✓ Required
SUPABASE_URL ✓ Required (auto-provided)
SUPABASE_ANON_KEY ✓ Required (auto-provided)
```

#### get-cpo-earnings
```
SUPABASE_URL ✓ Required (auto-provided)
SUPABASE_ANON_KEY ✓ Required (auto-provided)
```

#### calculate-marketplace-fees
```
SUPABASE_URL ✓ Required (auto-provided)
SUPABASE_ANON_KEY ✓ Required (auto-provided)
```

#### find-available-cpos
```
SUPABASE_URL ✓ Required (auto-provided)
SUPABASE_ANON_KEY ✓ Required (auto-provided)
```

### Auto-Provided Variables

Supabase automatically provides these variables to all Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

You only need to manually set:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

## Production Deployment

### Method 1: Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Set secrets
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Verify secrets are set
supabase secrets list
```

### Method 2: Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT
2. Navigate to: Edge Functions → Secrets
3. Click "Add Secret"
4. Add each required secret:
   - Name: `STRIPE_SECRET_KEY`, Value: `sk_live_...`
   - Name: `STRIPE_WEBHOOK_SECRET`, Value: `whsec_...`
   - Name: `SUPABASE_SERVICE_ROLE_KEY`, Value: `eyJhbGc...`

### Vercel Deployment (Principal & CPO Apps)

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Navigate to: Settings → Environment Variables
4. Add all `REACT_APP_*` variables from `.env.example`

**Important:**
- Do NOT add `STRIPE_SECRET_KEY` to Vercel (frontend security risk)
- Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (frontend security risk)

## Stripe Webhook Configuration

### Test Mode Setup

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Save endpoint and copy the signing secret
6. Set `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function secrets

### Production Mode Setup

Same as test mode, but:
1. Use production Stripe dashboard
2. Use production Supabase project URL
3. Use production webhook secret

## Security Best Practices

### ✅ DO:
- Keep `.env.local` files out of version control (already in `.gitignore`)
- Use different credentials for test and production
- Rotate secrets regularly
- Use environment-specific Stripe keys (test vs. live)
- Set Supabase RLS policies to protect data
- Use `REACT_APP_` prefix for frontend environment variables

### ❌ DON'T:
- Commit actual credentials to Git
- Use production credentials in development
- Expose `STRIPE_SECRET_KEY` in frontend apps
- Expose `SUPABASE_SERVICE_ROLE_KEY` in frontend apps
- Share credentials in public channels
- Use same webhook secrets for test and production

## Troubleshooting

### Issue: Edge Functions can't access environment variables

**Solution:**
```bash
# Check if secrets are set
supabase secrets list

# Re-deploy functions after setting secrets
supabase functions deploy FUNCTION_NAME
```

### Issue: Stripe webhook signature verification fails

**Solution:**
1. Verify `STRIPE_WEBHOOK_SECRET` matches the webhook endpoint secret in Stripe Dashboard
2. Ensure webhook URL is correct: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
3. Check Stripe webhook logs for errors

### Issue: Principal and CPO apps can't sync data

**Solution:**
1. Verify both apps use the SAME Supabase URL and anon key
2. Check Supabase RLS policies allow cross-app access
3. Ensure both apps are using the same database schema

### Issue: Push notifications not working

**Solution:**
1. Verify both apps use the SAME Firebase project credentials
2. Check Firebase Cloud Messaging is enabled
3. Ensure VAPID key is correctly set
4. Test with Firebase Console messaging tool

## Environment Variable Checklist

### Principal App (.env.local)
- [ ] `REACT_APP_SUPABASE_URL`
- [ ] `REACT_APP_SUPABASE_ANON_KEY`
- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_FIREBASE_VAPID_KEY`
- [ ] `REACT_APP_STRIPE_PUBLISHABLE_KEY`
- [ ] `REACT_APP_GOOGLE_MAPS_API_KEY`

### CPO App (.env.local)
- [ ] `REACT_APP_SUPABASE_URL` (same as Principal)
- [ ] `REACT_APP_SUPABASE_ANON_KEY` (same as Principal)
- [ ] `REACT_APP_FIREBASE_API_KEY` (same as Principal)
- [ ] `REACT_APP_FIREBASE_PROJECT_ID` (same as Principal)
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` (same as Principal)
- [ ] `REACT_APP_FIREBASE_APP_ID` (same as Principal)
- [ ] `REACT_APP_FIREBASE_VAPID_KEY` (same as Principal)

### Edge Functions (Supabase Secrets)
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Stripe Webhooks
- [ ] Webhook endpoint created
- [ ] Webhook secret copied to Edge Functions
- [ ] Required events selected
- [ ] Endpoint URL verified

## Support

For issues with:
- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs
- **Firebase:** https://firebase.google.com/docs
- **Vercel:** https://vercel.com/docs
