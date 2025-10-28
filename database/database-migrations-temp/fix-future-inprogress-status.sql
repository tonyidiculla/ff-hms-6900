-- Add validation to prevent future appointments from having "in-progress" status
-- An appointment can only be in-progress if the appointment date is today or in the past

-- Create constraint function to validate appointment status
CREATE OR REPLACE FUNCTION validate_appointment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status is being set to 'in-progress'
  IF NEW.status = 'in-progress' THEN
    -- Appointment date must be today or in the past
    IF NEW.appointment_date > CURRENT_DATE THEN
      RAISE EXCEPTION 'Cannot set appointment to in-progress: appointment date (%) is in the future', NEW.appointment_date;
    END IF;
    
    -- Optionally: Check if appointment time has passed (for same-day appointments)
    IF NEW.appointment_date = CURRENT_DATE AND NEW.appointment_time > CURRENT_TIME THEN
      RAISE WARNING 'Appointment time (%) has not arrived yet, but allowing in-progress status for same day', NEW.appointment_time;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate status on insert and update
DROP TRIGGER IF EXISTS trigger_validate_appointment_status ON hospitals_appointments;

CREATE TRIGGER trigger_validate_appointment_status
  BEFORE INSERT OR UPDATE OF status ON hospitals_appointments
  FOR EACH ROW
  EXECUTE FUNCTION validate_appointment_status();

-- Fix existing data: Reset any future appointments that are marked as "in-progress"
UPDATE hospitals_appointments
SET 
  status = 'scheduled',
  emr_write_access_active = false,
  updated_at = NOW()
WHERE status = 'in-progress'
  AND appointment_date > CURRENT_DATE;

-- Log how many were fixed
DO $$
DECLARE
  fixed_count INTEGER;
BEGIN
  GET DIAGNOSTICS fixed_count = ROW_COUNT;
  IF fixed_count > 0 THEN
    RAISE NOTICE 'Fixed % future appointment(s) that were incorrectly marked as in-progress', fixed_count;
  END IF;
END $$;

-- Add comment explaining the constraint
COMMENT ON FUNCTION validate_appointment_status() IS 
  'Validates that appointments can only be set to in-progress status if the appointment date is today or in the past. Prevents logical errors like future consultations being marked as active.';
