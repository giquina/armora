# Environment Variables Quick Reference

Quick lookup table for all environment variables across the Armora platform.

## Principal App (`/workspaces/armora/.env.local`)

| Variable | Value | Status | Where to Get |
|----------|-------|--------|--------------|
| `REACT_APP_SUPABASE_URL` | `https://jmzvrqwjmlnvxojculee.supabase.co` | ✅ Set | Supabase Dashboard |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGc...` | ✅ Set | Supabase Dashboard |
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyCBy...` | ✅ Set | Firebase Console |
| `REACT_APP_FIREBASE_PROJECT_ID` | `armora-protection` | ✅ Set | Firebase Console |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `1010601153585` | ✅ Set | Firebase Console |
| `REACT_APP_FIREBASE_APP_ID` | `1:1010601153585:web:...` | ✅ Set | Firebase Console |
| `REACT_APP_FIREBASE_VAPID_KEY` | - | ❌ Missing | Firebase Console → Cloud Messaging |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | `pk_test_51SDAOC...` | ✅ Set | Stripe Dashboard |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | `placeholder_google_maps_key` | ⚠️ Placeholder | Google Cloud Console |
| ~~`STRIPE_SECRET_KEY`~~ | - | ⚠️ Remove | Should NOT be in frontend |

## CPO App (`/workspaces/armora-cpo/.env.local`)

| Variable | Value | Status | Where to Get |
|----------|-------|--------|--------------|
| `REACT_APP_SUPABASE_URL` | `https://jmzvrqwjmlnvxojculee.supabase.co` | ✅ Set | Same as Principal |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGc...` | ✅ Set | Same as Principal |
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyCBy...` | ✅ Set | Same as Principal |
| `REACT_APP_FIREBASE_PROJECT_ID` | `armora-protection` | ✅ Set | Same as Principal |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `1010601153585` | ✅ Set | Same as Principal |
| `REACT_APP_FIREBASE_APP_ID` | `1:1010601153585:web:...` | ✅ Set | Same as Principal |
| `REACT_APP_FIREBASE_VAPID_KEY` | - | ❌ Missing | Same as Principal |
| `REACT_APP_CPO_APP_VERSION` | `1.0.0` | ✅ Set | Manual |
| `REACT_APP_ENVIRONMENT` | `development` | ✅ Set | Manual |

## Edge Functions (`/workspaces/armora/supabase/functions/.env`)

### Local Development

| Variable | Value | Status | Where to Get |
|----------|-------|--------|--------------|
| `STRIPE_SECRET_KEY` | `sk_test_51SDAOC...` | ✅ Set | Stripe Dashboard |
| `STRIPE_WEBHOOK_SECRET` | `whsec_placeholder` | ⚠️ Placeholder | Stripe Dashboard (after creating webhook) |
| `SUPABASE_URL` | `https://jmzvrqwjmlnvxojculee.supabase.co` | ✅ Set | Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | ✅ Set | Supabase Dashboard |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` | ✅ Set | Auto-provided by Supabase |

### Production (Supabase Secrets)

Set via CLI: `supabase secrets set VARIABLE_NAME=value`

| Variable | Required By | Status |
|----------|-------------|--------|
| `STRIPE_SECRET_KEY` | create-payment-intent, confirm-payment, stripe-webhook, process-cpo-payout | ⚠️ Need to set |
| `STRIPE_WEBHOOK_SECRET` | stripe-webhook | ⚠️ Need to set |
| `SUPABASE_SERVICE_ROLE_KEY` | create-payment-intent, confirm-payment, stripe-webhook | ⚠️ Need to set |

## Edge Function Dependencies

### create-payment-intent
```
✅ STRIPE_SECRET_KEY
✅ SUPABASE_URL (auto)
✅ SUPABASE_SERVICE_ROLE_KEY
```

### confirm-payment
```
✅ STRIPE_SECRET_KEY
✅ SUPABASE_URL (auto)
✅ SUPABASE_SERVICE_ROLE_KEY
```

### stripe-webhook
```
✅ STRIPE_SECRET_KEY
⚠️ STRIPE_WEBHOOK_SECRET (placeholder)
✅ SUPABASE_URL (auto)
✅ SUPABASE_SERVICE_ROLE_KEY
```

### process-cpo-payout
```
✅ STRIPE_SECRET_KEY
✅ SUPABASE_URL (auto)
✅ SUPABASE_ANON_KEY (auto)
```

### get-cpo-earnings
```
✅ SUPABASE_URL (auto)
✅ SUPABASE_ANON_KEY (auto)
```

### calculate-marketplace-fees
```
✅ SUPABASE_URL (auto)
✅ SUPABASE_ANON_KEY (auto)
```

### find-available-cpos
```
✅ SUPABASE_URL (auto)
✅ SUPABASE_ANON_KEY (auto)
```

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Set | Variable is configured with valid value |
| ❌ Missing | Variable is required but not set |
| ⚠️ Placeholder | Variable has placeholder value, needs real credential |
| ⚠️ Remove | Variable should not be in this location (security risk) |

## Action Items

### Immediate (Required for Production)
1. ❌ Obtain Firebase VAPID key and set in both apps
2. ⚠️ Replace Google Maps API placeholder with real key
3. ⚠️ Create Stripe webhook and update `STRIPE_WEBHOOK_SECRET`
4. ⚠️ Remove `STRIPE_SECRET_KEY` from Principal app `.env.local`

### Before Production Deploy
1. Set all Edge Function secrets in Supabase (production)
2. Update Stripe keys from test to live mode
3. Create production Stripe webhook endpoint
4. Set all environment variables in Vercel

### Optional Cleanup
1. Remove legacy Clerk variables from `.env.local`
2. Clean up unused variables

## Files Updated

- ✅ `/workspaces/armora/.env.example` - Updated with all variables and documentation
- ✅ `/workspaces/armora-cpo/.env.example` - Created with CPO-specific variables
- ✅ `/workspaces/armora/supabase/functions/.env` - Updated with function-specific docs
- ✅ `/workspaces/armora/ENVIRONMENT_SETUP.md` - Comprehensive setup guide
- ✅ `/workspaces/armora/MISSING_CREDENTIALS.md` - Missing credentials checklist
- ✅ `/workspaces/armora/ENV_QUICK_REFERENCE.md` - This quick reference

## Quick Commands

```bash
# View Principal app variables
grep -E "^REACT_APP_" /workspaces/armora/.env.local

# View CPO app variables
grep -E "^REACT_APP_" /workspaces/armora-cpo/.env.local

# View Edge Function variables
cat /workspaces/armora/supabase/functions/.env

# Set Supabase secret (production)
supabase secrets set VARIABLE_NAME=value

# List Supabase secrets (production)
supabase secrets list

# Deploy Edge Function
supabase functions deploy FUNCTION_NAME
```
