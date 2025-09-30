# Stripe Phase 1 Deployment Guide
## Armora Protection Service - Payment Integration

### ✅ Phase 1 Complete - What Was Created

#### 1. **Edge Function: `create-payment-intent`**
**Location:** `supabase/functions/create-payment-intent/index.ts`

**Features:**
- Secure server-side payment intent creation
- Authentication verification using Supabase auth
- Automatic VAT calculation (20% UK)
- Payment record creation in database
- Protection service terminology throughout
- CORS support for frontend requests
- Comprehensive error handling

**Environment Variables Required:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key from Supabase dashboard

---

#### 2. **Database Migration: `payments` Table**
**Location:** `supabase/migrations/20250930000001_create_payments_table.sql`

**Schema:**
```sql
- id (uuid, primary key)
- assignment_id (uuid, foreign key to protection_assignments)
- user_id (uuid, foreign key to auth.users)
- stripe_payment_intent_id (text, unique)
- stripe_charge_id (text)
- stripe_payment_method_id (text)
- amount (integer) - in pence
- currency (text, default 'gbp')
- status (enum: pending, succeeded, failed, refunded, cancelled)
- payment_method_type (text)
- metadata (jsonb)
- error_message (text)
- refund_reason (text)
- created_at, updated_at, succeeded_at, refunded_at (timestamps)
```

**Indexes:**
- user_id, assignment_id, stripe_payment_intent_id, status, created_at

**Security:**
- Row Level Security (RLS) enabled
- Users can only view their own payments
- Direct modifications blocked (Edge Functions only)

---

#### 3. **Frontend Update: `PaymentForm.tsx`**
**Changes:**
- Added Supabase client import
- Replaced mock `createPaymentIntent` with real API call
- Calls `/functions/v1/create-payment-intent` Edge Function
- Uses authenticated session token
- Proper error handling with user-friendly messages
- Maintains protection service terminology

**Lines Modified:** 1-21, 163-219

---

#### 4. **Configuration Files**
- `supabase/config.toml` - Local Supabase configuration
- `supabase/functions/.env` - Edge Functions environment variables
- `supabase/.gitignore` - Protects secrets from git

---

### 🚀 Deployment Steps

#### **Step 1: Install Supabase CLI**
```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or via npm
npm install -g supabase
```

#### **Step 2: Login to Supabase**
```bash
supabase login
```

#### **Step 3: Link to Your Project**
```bash
cd /workspaces/armora
supabase link --project-ref jmzvrqwjmlnvxojculee
```

#### **Step 4: Get Service Role Key**
1. Go to: https://supabase.com/dashboard/project/jmzvrqwjmlnvxojculee/settings/api
2. Copy the `service_role` key (under "Project API keys")
3. Update `supabase/functions/.env`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

#### **Step 5: Run Database Migration**
```bash
supabase db push
```

This creates the `payments` table with all indexes and RLS policies.

#### **Step 6: Deploy Edge Function**
```bash
supabase functions deploy create-payment-intent
```

#### **Step 7: Set Edge Function Secrets**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_XXXXX_your_stripe_test_key_here

supabase secrets set SUPABASE_URL=https://jmzvrqwjmlnvxojculee.supabase.co

supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Note:** Get your Stripe secret key from: https://dashboard.stripe.com/apikeys

---

### 🧪 Testing

#### **Local Testing (Before Deployment)**
```bash
# Start Supabase locally
supabase start

# Serve Edge Function locally
supabase functions serve create-payment-intent --env-file supabase/functions/.env

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/create-payment-intent' \
  --header 'Authorization: Bearer YOUR_SESSION_TOKEN' \
  --header 'Content-Type: application/json' \
  --data '{"amount":5000,"currency":"gbp","metadata":{"route":"Test → Location"}}'
```

#### **Frontend Testing**
1. Start dev server: `npm start`
2. Navigate to: http://localhost:3000
3. Sign in as a user
4. Go to protection assignment booking flow
5. Proceed to payment step
6. Check browser console for Edge Function calls
7. Use Stripe test card: `4242 4242 4242 4242`

---

### 📊 Verify Deployment

#### **Check Edge Function Status**
```bash
supabase functions list
```

Should show `create-payment-intent` as deployed.

#### **Check Database Table**
```sql
-- In Supabase SQL Editor
SELECT * FROM pg_tables WHERE tablename = 'payments';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'payments';
```

#### **Test Edge Function**
Visit: https://jmzvrqwjmlnvxojculee.supabase.co/functions/v1/create-payment-intent

Should return CORS error or 401 (this is expected - shows function is live).

---

### 🔍 Monitoring & Logs

#### **View Edge Function Logs**
```bash
supabase functions logs create-payment-intent
```

Or in Supabase Dashboard:
https://supabase.com/dashboard/project/jmzvrqwjmlnvxojculee/functions/create-payment-intent/logs

#### **View Database Activity**
Supabase Dashboard → Database → Logs

---

### 🐛 Troubleshooting

#### **"STRIPE_SECRET_KEY not configured"**
- Run: `supabase secrets set STRIPE_SECRET_KEY=sk_test_...`
- Redeploy: `supabase functions deploy create-payment-intent`

#### **"Invalid authentication token"**
- Check user is signed in
- Verify `Authorization` header format: `Bearer <token>`
- Check session hasn't expired

#### **"Table 'payments' does not exist"**
- Run: `supabase db push`
- Check migration status: `supabase migration list`

#### **CORS errors in browser**
- Edge Function includes CORS headers
- Check `Access-Control-Allow-Origin: *` in response
- Verify frontend uses correct Supabase URL

---

### 📝 What's Next (Phase 2)

After successful Phase 1 deployment:

1. **Webhook Handler** (`stripe-webhook` Edge Function)
   - Processes payment success/failure events
   - Updates payment status in database
   - Triggers notifications

2. **Payment Confirmation** (`confirm-payment` Edge Function)
   - Finalizes assignment after successful payment
   - Creates assignment record
   - Matches with available CPO

3. **Testing & Polish**
   - End-to-end payment flow testing
   - Error recovery mechanisms
   - Receipt generation
   - Monitoring and alerts

---

### 🔐 Security Checklist

- [x] Stripe secret key in Edge Function environment (not client-side)
- [x] Service role key protected in .env (gitignored)
- [x] RLS policies prevent direct payment modifications
- [x] Authentication required for payment intent creation
- [x] Payment amounts validated server-side
- [x] User can only view their own payments
- [ ] Production: Use live Stripe keys (when ready)
- [ ] Production: Enable Stripe webhook signature verification
- [ ] Production: Add rate limiting to Edge Function

---

### 📞 Support

**Supabase Dashboard:** https://supabase.com/dashboard/project/jmzvrqwjmlnvxojculee

**Stripe Dashboard:** https://dashboard.stripe.com/test/payments

**Armora GitHub:** (Your repository URL)

---

**Phase 1 Status:** ✅ **READY FOR DEPLOYMENT**

All code is complete. Follow deployment steps above to activate payment processing.
