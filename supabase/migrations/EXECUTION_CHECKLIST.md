# Migration Execution Checklist

## Pre-Execution Checklist

### Environment Verification
- [ ] **Supabase Project**: Confirm correct project (production/staging)
- [ ] **Database Backup**: Create backup before executing migration
- [ ] **Access Rights**: Verify you have admin access to Supabase project
- [ ] **Migration File**: Located at `/workspaces/armora/supabase/migrations/20251002_marketplace_transformation_phase1.sql`

### Review Migration Content
- [ ] **Read Migration File**: Reviewed all 484 lines
- [ ] **Understand Changes**: Understand all table alterations
- [ ] **Review Constraints**: Verified all constraints are appropriate
- [ ] **Check RLS Policies**: Reviewed security policies
- [ ] **Rollback Plan**: Reviewed rollback script at bottom of file

### Backup Steps
```bash
# Option 1: Supabase CLI backup
supabase db dump -f backup_before_marketplace_migration.sql

# Option 2: Direct pg_dump
pg_dump "postgresql://postgres:[password]@[host]:[port]/postgres" \
  -f backup_$(date +%Y%m%d_%H%M%S).sql
```

## Execution Steps

### Method 1: Supabase Dashboard (Recommended)

1. **Navigate to SQL Editor**
   - [ ] Go to https://app.supabase.com
   - [ ] Select your project
   - [ ] Click "SQL Editor" in left sidebar

2. **Load Migration File**
   - [ ] Click "New query" button
   - [ ] Copy content from `20251002_marketplace_transformation_phase1.sql`
   - [ ] Paste into SQL editor

3. **Execute Migration**
   - [ ] Click "Run" button (bottom right)
   - [ ] Wait for execution to complete
   - [ ] Review output for any errors

4. **Verify Success**
   - [ ] Check for success messages in output
   - [ ] Look for "MIGRATION COMPLETE" message
   - [ ] Verify no error messages

### Method 2: Supabase CLI

```bash
# 1. Ensure CLI is installed
- [ ] npm install -g supabase

# 2. Link to project (if not already linked)
- [ ] supabase link --project-ref your-project-ref

# 3. Run migration
- [ ] supabase db push

# 4. Verify migration ran
- [ ] supabase db remote changes
```

### Method 3: Direct psql

```bash
# 1. Get connection string from Supabase dashboard
- [ ] Settings → Database → Connection string

# 2. Execute migration
- [ ] psql "postgresql://postgres:[password]@[host]:[port]/postgres" \
      -f /workspaces/armora/supabase/migrations/20251002_marketplace_transformation_phase1.sql

# 3. Check output for errors
```

## Post-Execution Verification

### Step 1: Verify Tables

```sql
-- Check protection_officers new columns
- [ ] SELECT column_name, data_type, column_default
     FROM information_schema.columns
     WHERE table_name = 'protection_officers'
       AND column_name IN (
         'stripe_connect_id',
         'stripe_connect_status',
         'contractor_status',
         'daily_rate',
         'is_available'
       );

-- Expected: 5 rows returned
```

```sql
-- Check protection_assignments new columns
- [ ] SELECT column_name, data_type, column_default
     FROM information_schema.columns
     WHERE table_name = 'protection_assignments'
       AND column_name IN (
         'client_total',
         'platform_fee',
         'cpo_earnings',
         'payout_status'
       );

-- Expected: 4 rows returned
```

```sql
-- Check cpo_payouts table exists
- [ ] SELECT table_name
     FROM information_schema.tables
     WHERE table_name = 'cpo_payouts';

-- Expected: 1 row returned
```

### Step 2: Verify Constraints

```sql
-- Check constraints on protection_officers
- [ ] SELECT constraint_name, constraint_type
     FROM information_schema.table_constraints
     WHERE table_name = 'protection_officers'
       AND constraint_name LIKE '%marketplace%'
        OR constraint_name LIKE '%stripe%'
        OR constraint_name LIKE '%contractor%';

-- Expected: Multiple rows for CHECK and UNIQUE constraints
```

```sql
-- Check constraints on protection_assignments
- [ ] SELECT constraint_name, constraint_type
     FROM information_schema.table_constraints
     WHERE table_name = 'protection_assignments'
       AND constraint_name LIKE '%payout%'
        OR constraint_name LIKE '%commission%';

-- Expected: Multiple rows for CHECK constraints
```

### Step 3: Verify Indexes

```sql
-- Check all new indexes
- [ ] SELECT indexname, tablename
     FROM pg_indexes
     WHERE indexname LIKE '%protection_officers%'
        OR indexname LIKE '%protection_assignments%'
        OR indexname LIKE '%cpo_payouts%'
     ORDER BY tablename, indexname;

-- Expected: 14 new indexes
```

### Step 4: Verify RLS Policies

```sql
-- Check RLS policies on cpo_payouts
- [ ] SELECT policyname, cmd, qual, with_check
     FROM pg_policies
     WHERE tablename = 'cpo_payouts';

-- Expected: 5 policies (SELECT, INSERT, UPDATE, DELETE + service role)
```

### Step 5: Verify Functions

```sql
-- Test calculate_payment_split function
- [ ] SELECT * FROM calculate_payment_split(100.00, 0.15);

-- Expected: client_total=100.00, platform_fee=15.00, cpo_earnings=85.00
```

```sql
-- Check functions exist
- [ ] SELECT routine_name, routine_type
     FROM information_schema.routines
     WHERE routine_name IN ('calculate_payment_split', 'get_cpo_payout_summary');

-- Expected: 2 functions
```

### Step 6: Verify Data Migration

```sql
-- Check if existing assignments were migrated
- [ ] SELECT
       COUNT(*) as total_assignments,
       COUNT(client_total) as migrated_with_payment_split,
       COUNT(CASE WHEN client_total IS NULL THEN 1 END) as missing_payment_split
     FROM protection_assignments
     WHERE service_fee IS NOT NULL;

-- Expected: migrated_with_payment_split should equal total_assignments
```

## Validation Tests

### Test 1: Create Test CPO with Marketplace Fields

```sql
- [ ] INSERT INTO protection_officers (
       clerk_user_id,
       email,
       full_name,
       sia_license,
       contractor_status,
       daily_rate,
       hourly_rate,
       is_available
     ) VALUES (
       'test-clerk-' || gen_random_uuid(),
       'test.cpo@armora.test',
       'Test CPO Marketplace',
       'SIA-TEST-' || FLOOR(RANDOM() * 1000000),
       'onboarding',
       180.00,
       22.50,
       false
     )
     RETURNING id, contractor_status, daily_rate, is_available;

-- Expected: Success with returned values
```

### Test 2: Create Test Assignment with Payment Split

```sql
- [ ] INSERT INTO protection_assignments (
       principal_id,
       protection_level,
       commencement_point,
       secure_destination,
       scheduled_start,
       service_fee,
       client_total,
       commission_rate
     ) VALUES (
       (SELECT id FROM principals LIMIT 1),
       'executive',
       '{"lat": 51.5074, "lng": -0.1278, "address": "London"}'::jsonb,
       '{"lat": 51.4545, "lng": -2.5879, "address": "Bristol"}'::jsonb,
       NOW() + INTERVAL '1 day',
       200.00,
       200.00,
       0.15
     )
     RETURNING id, client_total, platform_fee, cpo_earnings;

-- Expected: Success with calculated platform_fee and cpo_earnings
```

### Test 3: Calculate Payment Split

```sql
- [ ] SELECT * FROM calculate_payment_split(250.00, 0.15);

-- Expected:
-- client_total | platform_fee | cpo_earnings
-- 250.00       | 37.50        | 212.50
```

### Test 4: Create Test Payout

```sql
- [ ] WITH test_data AS (
       SELECT
         (SELECT id FROM protection_officers LIMIT 1) as cpo_id,
         (SELECT id FROM protection_assignments WHERE client_total IS NOT NULL LIMIT 1) as assignment_id,
         100.00 as amount,
         15.00 as platform_fee,
         115.00 as client_total
     )
     INSERT INTO cpo_payouts (
       cpo_id,
       assignment_id,
       amount,
       platform_fee,
       client_total,
       expected_payout_date
     )
     SELECT
       cpo_id,
       assignment_id,
       amount,
       platform_fee,
       client_total,
       CURRENT_DATE + INTERVAL '7 days'
     FROM test_data
     WHERE NOT EXISTS (
       SELECT 1 FROM cpo_payouts
       WHERE assignment_id = (SELECT assignment_id FROM test_data)
     )
     RETURNING id, status, expected_payout_date;

-- Expected: Success with pending status
```

### Test 5: Test RLS Policies

```sql
-- As authenticated user (CPO)
- [ ] SET LOCAL role TO authenticated;
     SET LOCAL request.jwt.claims TO '{"sub": "[cpo-uuid]"}';
     SELECT COUNT(*) FROM cpo_payouts WHERE cpo_id = '[cpo-uuid]';

-- Expected: Can see own payouts
```

## Cleanup Test Data

```sql
-- Remove test records
- [ ] DELETE FROM cpo_payouts WHERE metadata->>'test' = 'true';
     DELETE FROM protection_assignments WHERE special_requirements LIKE '%TEST%';
     DELETE FROM protection_officers WHERE email LIKE '%.test';
```

## Performance Verification

### Query Performance Tests

```sql
-- Test 1: Find available CPOs (should use index)
- [ ] EXPLAIN ANALYZE
     SELECT * FROM protection_officers
     WHERE is_available = true
       AND availability_status = 'available'
       AND contractor_status = 'active';

-- Expected: Index scan on idx_protection_officers_availability
```

```sql
-- Test 2: Get pending assignments (should use index)
- [ ] EXPLAIN ANALYZE
     SELECT * FROM protection_assignments
     WHERE status = 'pending'
     ORDER BY created_at DESC;

-- Expected: Index scan on idx_protection_assignments_available
```

```sql
-- Test 3: Get CPO payouts (should use index)
- [ ] EXPLAIN ANALYZE
     SELECT * FROM cpo_payouts
     WHERE cpo_id = '[some-cpo-uuid]'
     ORDER BY created_at DESC;

-- Expected: Index scan on idx_cpo_payouts_cpo_id
```

## Rollback Procedure (If Needed)

### When to Rollback
- [ ] Critical errors during migration
- [ ] Data integrity issues discovered
- [ ] Unexpected constraint violations
- [ ] Performance degradation

### Rollback Steps
1. **Stop all application traffic**
   - [ ] Put application in maintenance mode
   - [ ] Stop all background jobs

2. **Restore from backup**
   ```sql
   - [ ] psql "postgresql://..." -f backup_before_marketplace_migration.sql
   ```

3. **Or use migration rollback script**
   - [ ] Uncomment rollback section at bottom of migration file
   - [ ] Execute rollback commands in order
   - [ ] Verify all changes reverted

4. **Verify rollback**
   - [ ] Check tables reverted to original state
   - [ ] Verify application functionality
   - [ ] Review logs for issues

## Post-Migration Tasks

### Immediate Tasks
- [ ] **Notify Team**: Inform development team migration completed
- [ ] **Update Documentation**: Mark migration as executed
- [ ] **Monitor Logs**: Watch for any errors in application logs
- [ ] **Test Application**: Verify application functionality

### Next Steps
- [ ] **Phase 2**: Implement Stripe Connect service layer
- [ ] **Update TypeScript Types**: Add new field types to codebase
- [ ] **Create Service Functions**: Build payout processing logic
- [ ] **Build UI Components**: Create CPO dashboard and earnings views

### Documentation Updates
- [ ] Update API documentation with new fields
- [ ] Create developer guide for payment calculations
- [ ] Document Stripe Connect integration process
- [ ] Add marketplace flow diagrams

## Success Criteria

Migration is successful if ALL of these are true:

- [ ] All SQL statements executed without errors
- [ ] All new columns exist in tables
- [ ] All constraints are active
- [ ] All indexes are created
- [ ] All RLS policies are active
- [ ] All functions are created and working
- [ ] Existing data migrated correctly
- [ ] Test queries run successfully
- [ ] Performance is acceptable
- [ ] No data loss occurred

## Troubleshooting

### Common Issues

**Issue**: Column already exists error
- **Solution**: Migration is idempotent, safe to re-run. Error is expected if column exists.

**Issue**: Constraint violation during migration
- **Solution**: Check existing data for invalid values, update before re-running.

**Issue**: Index creation timeout
- **Solution**: Create indexes one at a time, or increase statement timeout.

**Issue**: RLS policy conflicts
- **Solution**: Drop existing policies manually, then re-run migration.

**Issue**: Function already exists
- **Solution**: Use `CREATE OR REPLACE FUNCTION` or drop manually first.

### Emergency Contacts

- **Database Admin**: [Contact Info]
- **DevOps Team**: [Contact Info]
- **Supabase Support**: https://supabase.com/support

## Sign-off

Migration executed by: _______________
Date: _______________
Time: _______________
Result: ⬜ Success  ⬜ Failed  ⬜ Rolled Back

Notes:
________________________________________________________________
________________________________________________________________
________________________________________________________________

---

**Checklist Version**: 1.0.0
**Migration File**: `20251002_marketplace_transformation_phase1.sql`
**Created**: October 2, 2025
