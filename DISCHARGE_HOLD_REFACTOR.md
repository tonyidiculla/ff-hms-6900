# Discharge Hold Refactor: Boolean to Status Value

## Overview
Refactored `discharge_hold` from a separate boolean field to a status value in the `status` column. This simplifies the data model and aligns with the existing pattern where status already mixed administrative states (active, discharged) with medical conditions (critical, stable).

## Changes Made

### 1. Database Schema (`007_discharge_hold_as_status.sql`)
- **Removed**: `discharge_hold` BOOLEAN column
- **Added**: `'discharge_hold'` as a valid status value
- **Kept**: `discharge_hold_reason` TEXT column (used when status = 'discharge_hold')
- **Updated**: Status check constraint to include 'discharge_hold'
- **Added**: Index on status column for filtering discharge_hold records

### 2. TypeScript Type Definitions (`types/admission.ts`)
- **Updated Status Union Types**:
  ```typescript
  status?: 'active' | 'critical' | 'stable' | 'discharge_hold' | 'discharged'
  ```
- **Removed**: `discharge_hold?: boolean` from all interfaces
- **Kept**: `discharge_hold_reason?: string | null`

### 3. Backend API (`/api/inpatient/admissions/[id]/route.ts`)
- **Removed**: `discharge_hold` boolean field handling
- **Kept**: `status` and `discharge_hold_reason` field handling
- Status is now the single source of truth for discharge hold state

### 4. Frontend UI (`app/inpatient/admissions/page.tsx`)
- **Replaced**: Checkbox for "Hold Discharge" → Status dropdown
- **Added**: New status options in dropdown:
  - Active - Normal Care
  - Critical - Requires Close Monitoring
  - Stable - Improving Condition
  - **Discharge Hold - Ready but Held** ← NEW
  - Discharged - Released
- **Conditional Textarea**: Shows required reason field when status = 'discharge_hold'
- **Badge Display**: Added yellow badge for discharge_hold status
- **Form Validation**: Validates reason is provided when status is discharge_hold

### 5. API Client & Hooks
- **api-client.ts**: Removed `discharge_hold` boolean from updateAdmission signature
- **useHMSMicroservices.ts**: Removed `discharge_hold` boolean from mutation type

### 6. Documentation (`GLOSSARY_OF_VARIABLES.md`)
- Updated to reflect discharge_hold as a status value
- Added clear status values section explaining each state

## Status Value Meanings

| Status | Meaning | When to Use |
|--------|---------|-------------|
| `active` | Patient admitted, receiving normal care | Default admission state |
| `critical` | Patient in critical condition | Requires intensive monitoring |
| `stable` | Patient condition improving | Ready for discharge planning |
| `discharge_hold` | Ready for discharge but held | Admin reasons (unpaid bills) or medical (pending tests) |
| `discharged` | Patient has been released | Final state |

## Migration Steps

1. **Run SQL Migration**:
   ```bash
   # In Supabase SQL Editor
   # Execute: ff-hms-6900/database/migrations/007_discharge_hold_as_status.sql
   ```

2. **Verify Schema**:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'hospital_inpatients' 
   AND column_name IN ('status', 'discharge_hold', 'discharge_hold_reason');
   ```
   Expected: `discharge_hold` column should NOT exist

3. **Check Constraint**:
   ```sql
   SELECT conname, pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conname = 'hospital_inpatients_status_check';
   ```
   Expected: Should include 'discharge_hold' in CHECK constraint

## Benefits

1. **Simpler Data Model**: One field (status) instead of two (status + discharge_hold)
2. **Clear Workflow**: active → critical/stable → discharge_hold → discharged
3. **Consistent Pattern**: All status values represent admission lifecycle stages
4. **Better Filtering**: Single field to query all patient states
5. **Audit Trail**: discharge_hold_reason still captures why discharge is held

## Testing Checklist

- [ ] Update admission status to 'discharge_hold' without reason → Should show validation error
- [ ] Update status to 'discharge_hold' with reason → Should save successfully
- [ ] Update status from 'discharge_hold' to 'stable' → Should clear reason
- [ ] View admission with discharge_hold status → Should show yellow badge
- [ ] Filter admissions by status → Should include discharge_hold option
- [ ] Check database constraint → Should prevent invalid status values

## Backward Compatibility

⚠️ **Breaking Change**: Any code expecting `discharge_hold` boolean field will break.

**What to check**:
- Dashboard Monitor (if it reads discharge_hold field)
- Reports/analytics querying discharge_hold column
- External integrations expecting discharge_hold in API responses

**Migration for existing data**:
If there's existing data with `discharge_hold = TRUE`, run this before the migration:
```sql
UPDATE hospital_inpatients 
SET status = 'discharge_hold' 
WHERE discharge_hold = TRUE 
AND status NOT IN ('discharged');
```
