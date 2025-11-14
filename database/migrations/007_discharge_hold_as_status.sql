-- Migration: Convert discharge_hold from boolean to status value
-- Date: 2025-11-14
-- Description: Remove discharge_hold boolean column, add 'discharge_hold' as a status option

-- Step 1: Drop the discharge_hold boolean column (if it exists)
ALTER TABLE hospital_inpatients
DROP COLUMN IF EXISTS discharge_hold;

-- Step 2: Update any existing check constraint on status to include discharge_hold
-- First, drop the existing constraint if it exists
ALTER TABLE hospital_inpatients
DROP CONSTRAINT IF EXISTS hospital_inpatients_status_check;

-- Add new constraint with discharge_hold and ready_for_discharge as valid statuses
ALTER TABLE hospital_inpatients
ADD CONSTRAINT hospital_inpatients_status_check 
CHECK (status IN ('active', 'critical', 'stable', 'ready_for_discharge', 'discharge_hold', 'discharged'));

-- Step 3: Ensure discharge_hold_reason column exists
ALTER TABLE hospital_inpatients
ADD COLUMN IF NOT EXISTS discharge_hold_reason TEXT;

-- Step 4: Add index for filtering by discharge_hold status
CREATE INDEX IF NOT EXISTS idx_hospital_inpatients_discharge_hold_status
ON hospital_inpatients(status) 
WHERE status = 'discharge_hold';

-- Step 5: Add comments for documentation
COMMENT ON COLUMN hospital_inpatients.status IS 
  'Patient admission status: active (normal care), critical (intensive monitoring - clinical), stable (improving - clinical), ready_for_discharge (medically cleared), discharge_hold (ready but held for admin/medical reasons), discharged (released)';

COMMENT ON COLUMN hospital_inpatients.discharge_hold_reason IS 
  'Required explanation when status is discharge_hold. Examples: unpaid bills, pending test results, additional care required';

-- Verification queries (run these manually to check):
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'hospital_inpatients' AND column_name IN ('status', 'discharge_hold', 'discharge_hold_reason');
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'hospital_inpatients_status_check';
