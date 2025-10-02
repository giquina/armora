# Armora Database Migrations

## 📋 Overview

This directory contains SQL migration files for the Armora protection services platform. Migrations are versioned and executed in chronological order.

## 🚀 Latest Migration: Marketplace Transformation Phase 1

**File**: `20251002_marketplace_transformation_phase1.sql`
**Status**: ✅ Ready for execution (NOT YET EXECUTED)
**Purpose**: Transform Armora from dispatch model to marketplace platform

### What's Included

1. **Migration File** (`20251002_marketplace_transformation_phase1.sql`)
   - Complete database schema changes
   - 484 lines of SQL
   - Fully idempotent (safe to run multiple times)
   - Includes rollback script

2. **Migration Summary** (`MIGRATION_SUMMARY.md`)
   - Comprehensive overview of changes
   - Execution instructions
   - Verification steps
   - Expected results

3. **Schema Reference** (`SCHEMA_REFERENCE.md`)
   - Quick reference for all new fields
   - Common queries and examples
   - TypeScript type definitions
   - Helper function documentation

4. **Execution Checklist** (`EXECUTION_CHECKLIST.md`)
   - Step-by-step execution guide
   - Pre/post verification steps
   - Troubleshooting guide
   - Rollback procedures

## ⚡ Quick Start

### Option 1: Supabase Dashboard (Recommended)

1. Open https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Copy content from `20251002_marketplace_transformation_phase1.sql`
5. Paste and click "Run"

### Option 2: Supabase CLI

```bash
# Install CLI if needed
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

### Option 3: Direct SQL

```bash
# Using psql
psql "postgresql://postgres:[password]@[host]:[port]/postgres" \
  -f /workspaces/armora/supabase/migrations/20251002_marketplace_transformation_phase1.sql
```

## 📊 Migration Summary

### Changes Made

#### Protection Officers Table
- ✅ Added 13 new marketplace fields
- ✅ Stripe Connect integration
- ✅ Contractor status management
- ✅ Rate configuration (daily/hourly)
- ✅ Availability toggle

#### Protection Assignments Table
- ✅ Added 10 new payment fields
- ✅ Payment split tracking (client/platform/CPO)
- ✅ Payout status management
- ✅ Enhanced lifecycle timestamps

#### New: CPO Payouts Table
- ✅ Created complete payout tracking system
- ✅ 18 columns for comprehensive tracking
- ✅ Stripe integration fields
- ✅ Failure handling and retry logic

#### Infrastructure
- ✅ 14 performance indexes
- ✅ 7 RLS security policies
- ✅ 2 helper functions
- ✅ Data migration for existing records

## 🔍 Key Features

### Payment Split Calculation

```sql
-- Calculate 15% platform fee on £100
SELECT * FROM calculate_payment_split(100.00, 0.15);

-- Result:
-- client_total: 100.00
-- platform_fee: 15.00
-- cpo_earnings: 85.00
```

### CPO Earnings Summary

```sql
-- Get earnings summary for a CPO
SELECT * FROM get_cpo_payout_summary('cpo-uuid-here');

-- Returns: total_earnings, total_paid, total_pending, etc.
```

### Find Available CPOs

```sql
SELECT * FROM protection_officers
WHERE is_available = true
  AND availability_status = 'available'
  AND contractor_status = 'active'
  AND stripe_connect_status = 'active';
```

## 📁 Files in This Directory

### Migration Files
- `20250930000001_fix_payments_table.sql` - Payment table fixes
- `20250930000003_create_subscriptions_table.sql` - Subscriptions table
- `20251002_marketplace_transformation_phase1.sql` - **Marketplace transformation** ⭐

### Documentation
- `README.md` - This file
- `MIGRATION_SUMMARY.md` - Detailed migration overview
- `SCHEMA_REFERENCE.md` - Schema quick reference
- `EXECUTION_CHECKLIST.md` - Execution checklist

## ✅ Pre-Execution Checklist

Before running the migration:

- [ ] **Backup database** - Create a backup of current database
- [ ] **Review changes** - Read through migration file
- [ ] **Check environment** - Verify you're in correct environment (prod/staging)
- [ ] **Test credentials** - Ensure you have admin access
- [ ] **Read documentation** - Review MIGRATION_SUMMARY.md

## 🧪 Post-Execution Verification

After running the migration:

```sql
-- 1. Verify new columns in protection_officers
SELECT column_name FROM information_schema.columns
WHERE table_name = 'protection_officers'
  AND column_name IN ('stripe_connect_id', 'contractor_status', 'daily_rate');

-- 2. Verify new columns in protection_assignments
SELECT column_name FROM information_schema.columns
WHERE table_name = 'protection_assignments'
  AND column_name IN ('client_total', 'platform_fee', 'cpo_earnings');

-- 3. Verify cpo_payouts table exists
SELECT COUNT(*) FROM cpo_payouts;

-- 4. Test helper functions
SELECT * FROM calculate_payment_split(100.00, 0.15);
```

## 🔄 Migration Workflow

```
1. Review Migration File
   ↓
2. Backup Database
   ↓
3. Execute Migration
   ↓
4. Verify Changes
   ↓
5. Test Functionality
   ↓
6. Update Application Code
```

## 📈 Next Steps After Migration

### Immediate (Phase 2)
1. **Stripe Connect Integration**
   - Implement onboarding flow
   - Create transfer service
   - Add webhook handlers

2. **Service Layer**
   - Payout processing service
   - Payment calculation service
   - Assignment lifecycle management

### Short-term (Phase 3)
3. **UI/UX Implementation**
   - CPO earnings dashboard
   - Assignment acceptance flow
   - Payout history view

4. **Testing & Validation**
   - Unit tests for payment logic
   - Integration tests for Stripe
   - E2E marketplace flow tests

## 🐛 Troubleshooting

### Common Issues

**Error**: Column already exists
- **Solution**: This is expected if re-running. Migration is idempotent.

**Error**: Constraint violation
- **Solution**: Check existing data validity before re-running.

**Error**: Timeout on index creation
- **Solution**: Increase statement timeout or create indexes separately.

### Getting Help

1. Check `EXECUTION_CHECKLIST.md` for detailed troubleshooting
2. Review `SCHEMA_REFERENCE.md` for field definitions
3. Consult rollback script at bottom of migration file

## 🔐 Security

### Row Level Security (RLS)

All tables have proper RLS policies:

- ✅ CPOs can only view their own payouts
- ✅ CPOs can only update their own profile
- ✅ Service role has full access
- ✅ No direct payout modifications by users

### Data Protection

- ✅ Sensitive financial data protected
- ✅ Stripe credentials isolated
- ✅ Audit trails maintained
- ✅ Failure tracking implemented

## 📊 Statistics

### Migration Size
- **Total Lines**: 484
- **DDL Statements**: 89
- **Safety Clauses**: 102 (IF NOT EXISTS/IF EXISTS)
- **Constraints**: 13
- **Indexes**: 14
- **Policies**: 7
- **Functions**: 2

### Tables Modified
- `protection_officers` - 13 new columns
- `protection_assignments` - 10 new columns
- `cpo_payouts` - 18 columns (new table)

### Performance
- ✅ All critical queries indexed
- ✅ Optimized for marketplace operations
- ✅ Efficient payout lookups
- ✅ Fast availability searches

## 🔗 Related Files

### Project Root
- `/workspaces/armora/migration-scripts/create_database_tables.sql` - Original schema
- `/workspaces/armora/src/utils/supabaseSchema.sql` - Schema reference

### Application Code
- Update TypeScript types after migration
- Implement new service functions
- Create UI components for marketplace

## 📝 Migration History

| Date | File | Description | Status |
|------|------|-------------|--------|
| 2025-09-30 | `20250930000001_fix_payments_table.sql` | Fix payment table structure | ✅ Executed |
| 2025-09-30 | `20250930000003_create_subscriptions_table.sql` | Create subscriptions | ✅ Executed |
| 2025-10-02 | `20251002_marketplace_transformation_phase1.sql` | Marketplace transformation | ⏳ Ready |

## 🎯 Success Criteria

Migration is successful when:

- ✅ All SQL executes without errors
- ✅ All new columns/tables created
- ✅ All constraints active
- ✅ All indexes created
- ✅ All RLS policies active
- ✅ Helper functions working
- ✅ Existing data migrated
- ✅ Application tests pass

---

## 📚 Documentation Index

1. **MIGRATION_SUMMARY.md** - Complete overview, execution instructions, verification
2. **SCHEMA_REFERENCE.md** - Field reference, queries, TypeScript types
3. **EXECUTION_CHECKLIST.md** - Step-by-step checklist, troubleshooting
4. **README.md** - This file, quick start guide

---

**Status**: ✅ Ready for execution
**Version**: 1.0.0
**Last Updated**: October 2, 2025
**Created By**: Armora Development Team
