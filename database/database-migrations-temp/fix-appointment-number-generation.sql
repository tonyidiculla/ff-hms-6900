-- Fix appointment number generation to handle duplicates
-- This prevents the "duplicate key value" error

CREATE OR REPLACE FUNCTION generate_appointment_number()
RETURNS TEXT AS $$
DECLARE
  date_part TEXT;
  sequence_part INTEGER;
  new_number TEXT;
  attempt_count INTEGER := 0;
  max_attempts INTEGER := 100;
BEGIN
  date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
  
  -- Loop until we find a unique number (or hit max attempts)
  LOOP
    -- Get the count of appointments today and increment
    SELECT COALESCE(MAX(
      CAST(
        SUBSTRING(appointment_number FROM 'APT-[0-9]{8}-([0-9]{4})') 
        AS INTEGER
      )
    ), 0) + 1
    INTO sequence_part
    FROM hospital_master_appointments
    WHERE appointment_number LIKE 'APT-' || date_part || '-%';
    
    new_number := 'APT-' || date_part || '-' || LPAD(sequence_part::TEXT, 4, '0');
    
    -- Check if this number already exists
    IF NOT EXISTS (
      SELECT 1 FROM hospital_master_appointments 
      WHERE appointment_number = new_number
    ) THEN
      RETURN new_number;
    END IF;
    
    -- Prevent infinite loop
    attempt_count := attempt_count + 1;
    IF attempt_count >= max_attempts THEN
      RAISE EXCEPTION 'Could not generate unique appointment number after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- The trigger function remains the same
CREATE OR REPLACE FUNCTION set_appointment_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.appointment_number IS NULL THEN
    NEW.appointment_number := generate_appointment_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger (in case it doesn't exist)
DROP TRIGGER IF EXISTS trigger_set_appointment_number ON hospitals_appointments;

CREATE TRIGGER trigger_set_appointment_number
  BEFORE INSERT ON hospitals_appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_appointment_number();
