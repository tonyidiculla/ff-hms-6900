-- Auto-verify OTP for appointments if the same pet already has a verified appointment today
-- This improves UX by not requiring owners to verify OTP multiple times for the same pet

-- Function to check if pet has verified appointment today
CREATE OR REPLACE FUNCTION check_pet_otp_verified_today(p_pet_platform_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM hospital_master_appointments
    WHERE pet_platform_id = p_pet_platform_id
      AND appointment_date = CURRENT_DATE
      AND emr_otp_verified = true
      AND status != 'cancelled'
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-verify OTP if pet already verified today
CREATE OR REPLACE FUNCTION auto_verify_otp_for_same_pet()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-verify for new appointments (INSERT) or when status changes to scheduled
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status = 'scheduled')) THEN
    -- Check if this pet has any verified appointment today
    IF check_pet_otp_verified_today(NEW.pet_platform_id) THEN
      -- Auto-verify this appointment's OTP
      NEW.emr_otp_verified := true;
      NEW.emr_otp_code := NULL; -- Clear OTP code since it's auto-verified
      NEW.emr_otp_sent_to_owner := true; -- Mark as "processed"
      
      -- Optionally log this action
      RAISE NOTICE 'Auto-verified OTP for appointment % (pet % already verified today)', NEW.id, NEW.pet_platform_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-verification
DROP TRIGGER IF EXISTS trigger_auto_verify_otp ON hospitals_appointments;

CREATE TRIGGER trigger_auto_verify_otp
  BEFORE INSERT OR UPDATE ON hospitals_appointments
  FOR EACH ROW
  EXECUTE FUNCTION auto_verify_otp_for_same_pet();

-- Also create a function to manually sync verification across appointments for same pet
CREATE OR REPLACE FUNCTION sync_otp_verification_for_pet(p_pet_platform_id TEXT)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  -- If pet has any verified appointment today, verify all scheduled appointments for same pet
  IF check_pet_otp_verified_today(p_pet_platform_id) THEN
    UPDATE hospitals_appointments
    SET 
      emr_otp_verified = true,
      emr_otp_code = NULL,
      emr_otp_sent_to_owner = true,
      updated_at = NOW()
    WHERE pet_platform_id = p_pet_platform_id
      AND appointment_date = CURRENT_DATE
      AND status IN ('scheduled', 'confirmed')
      AND emr_otp_verified = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
  END IF;
  
  RETURN 0;
END;
$$ LANGUAGE plpgsql;

-- Add a comment explaining the logic
COMMENT ON FUNCTION auto_verify_otp_for_same_pet() IS 
  'Automatically verifies OTP for new appointments if the same pet already has a verified appointment today. Improves UX by not requiring multiple verifications for the same pet.';

COMMENT ON FUNCTION sync_otp_verification_for_pet(TEXT) IS 
  'Manually sync OTP verification status across all appointments for a pet on the same day. Call this after an OTP is verified to update other pending appointments.';
