-- Updated Generic Rostering System - Integrating with existing employee_to_entity_role_assignment table
-- This integrates with the current multi-tenant employee assignment structure

-- Analysis of existing employee_to_entity_role_assignment table:
-- ✅ id (UUID primary key)
-- ✅ user_id (UUID - links to auth users)
-- ✅ user_platform_id (VARCHAR - "H00000001" format)
-- ✅ entity_platform_id (VARCHAR - "E019nC8m3" format)  
-- ✅ employee_job_title (VARCHAR - "Founder & CEO")
-- ✅ employee_id (VARCHAR - "FDT-001" - entity-assigned ID)
-- ✅ employment_start_date, employment_end_date (DATE)
-- ✅ professional_email, professional_phone (VARCHAR)
-- ✅ is_active, is_approved (BOOLEAN)
-- ✅ platform_role_id (UUID - links to platform_roles table)
-- ✅ created_at, updated_at (TIMESTAMP)

-- RECOMMENDATION: 
-- Instead of creating new staff_members table, we should:
-- 1. Use existing employee_to_entity_role_assignment as the base
-- 2. Add rostering-specific columns to this table 
-- 3. Create separate scheduling tables that reference this table

-- 1. First, let's extend the existing employee table with rostering fields
ALTER TABLE employee_to_entity_role_assignment 
ADD COLUMN IF NOT EXISTS role_type VARCHAR(50), -- 'vet', 'nurse', 'groomer', etc.
ADD COLUMN IF NOT EXISTS slot_duration_minutes INTEGER DEFAULT 15, -- Default appointment slot length
ADD COLUMN IF NOT EXISTS can_take_appointments BOOLEAN DEFAULT true, -- Whether this employee can have appointments
ADD COLUMN IF NOT EXISTS rostering_enabled BOOLEAN DEFAULT false; -- Whether rostering is enabled for this employee

-- 2. Create indexes for rostering queries
CREATE INDEX IF NOT EXISTS idx_employee_entity_role ON employee_to_entity_role_assignment(entity_platform_id, role_type, is_active) WHERE rostering_enabled = true;
CREATE INDEX IF NOT EXISTS idx_employee_platform_id ON employee_to_entity_role_assignment(user_platform_id) WHERE is_active = true;

-- 3. Standard Time Slots (15-minute intervals, can be customized per role)
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_time TIME NOT NULL,
  slot_end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN DEFAULT true,
  
  UNIQUE(slot_time, duration_minutes)
);

-- Populate standard 15-minute slots from 06:00 to 22:00
INSERT INTO time_slots (slot_time, slot_end_time, duration_minutes) 
SELECT 
  time_val::TIME as slot_time,
  (time_val + INTERVAL '15 minutes')::TIME as slot_end_time,
  15 as duration_minutes
FROM generate_series(
  TIMESTAMP '2024-01-01 06:00:00',
  TIMESTAMP '2024-01-01 21:45:00',
  INTERVAL '15 minutes'
) AS time_val
ON CONFLICT (slot_time, duration_minutes) DO NOTHING;

-- 4. Employee Weekly Schedule (when they're available to work)
CREATE TABLE IF NOT EXISTS employee_weekly_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_assignment_id UUID REFERENCES employee_to_entity_role_assignment(id) ON DELETE CASCADE,
  entity_platform_id VARCHAR(255) NOT NULL, -- Denormalized for faster queries
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, 2=Tuesday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE DEFAULT CURRENT_DATE, -- When this schedule starts
  effective_until DATE, -- When this schedule ends (NULL = indefinite)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CHECK (day_of_week >= 0 AND day_of_week <= 6),
  CHECK (start_time < end_time),
  CHECK (effective_from <= COALESCE(effective_until, effective_from))
);

-- 5. Employee Schedule Exceptions (holidays, sick days, special hours)
CREATE TABLE IF NOT EXISTS employee_schedule_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_assignment_id UUID REFERENCES employee_to_entity_role_assignment(id) ON DELETE CASCADE,
  entity_platform_id VARCHAR(255) NOT NULL, -- Denormalized for faster queries
  exception_date DATE NOT NULL,
  exception_type VARCHAR(50) NOT NULL, -- 'holiday', 'sick_leave', 'special_hours', 'unavailable', 'training'
  start_time TIME, -- NULL for full day exceptions
  end_time TIME, -- NULL for full day exceptions
  reason TEXT,
  approved_by UUID REFERENCES employee_to_entity_role_assignment(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(employee_assignment_id, exception_date, start_time)
);

-- 6. Update appointments table to work with existing employee structure
-- Note: We're adding employee_assignment_id to link to the employee table
ALTER TABLE hospitals_appointments 
ADD COLUMN IF NOT EXISTS employee_assignment_id UUID REFERENCES employee_to_entity_role_assignment(id),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50); -- Denormalized for easier queries (matches employee_to_entity_role_assignment.employee_id)

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_employee_assignment ON hospitals_appointments(employee_assignment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_employee_id ON hospitals_appointments(entity_platform_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_schedule_entity_day ON employee_weekly_schedule(entity_platform_id, day_of_week, is_active);
CREATE INDEX IF NOT EXISTS idx_employee_exceptions_entity_date ON employee_schedule_exceptions(entity_platform_id, exception_date);

-- 7. Function to get available slots for an employee on a specific date
CREATE OR REPLACE FUNCTION get_employee_available_slots(
  p_entity_platform_id VARCHAR(255),
  p_employee_assignment_id UUID,
  p_date DATE
)
RETURNS TABLE(
  slot_time TIME,
  slot_end_time TIME,
  is_available BOOLEAN,
  booking_count INTEGER
) AS $$
DECLARE
  v_day_of_week INTEGER;
  v_slot_duration INTEGER;
BEGIN
  -- Get day of week (0=Sunday)
  v_day_of_week := EXTRACT(DOW FROM p_date);
  
  -- Get slot duration for this employee
  SELECT slot_duration_minutes INTO v_slot_duration
  FROM employee_to_entity_role_assignment
  WHERE id = p_employee_assignment_id;
  
  v_slot_duration := COALESCE(v_slot_duration, 15); -- Default to 15 minutes
  
  RETURN QUERY
  WITH employee_schedule AS (
    -- Get the employee's regular schedule for this day
    SELECT ews.start_time, ews.end_time
    FROM employee_weekly_schedule ews
    WHERE ews.employee_assignment_id = p_employee_assignment_id
      AND ews.day_of_week = v_day_of_week
      AND ews.is_active = true
      AND p_date >= ews.effective_from
      AND (ews.effective_until IS NULL OR p_date <= ews.effective_until)
  ),
  exceptions AS (
    -- Check for any exceptions on this date
    SELECT ese.start_time, ese.end_time, ese.exception_type
    FROM employee_schedule_exceptions ese
    WHERE ese.employee_assignment_id = p_employee_assignment_id
      AND ese.exception_date = p_date
  ),
  available_slots AS (
    SELECT 
      ts.slot_time,
      ts.slot_end_time
    FROM time_slots ts
    CROSS JOIN employee_schedule es
    WHERE ts.duration_minutes = v_slot_duration
      AND ts.slot_time >= es.start_time
      AND ts.slot_end_time <= es.end_time
      -- Exclude exception periods
      AND NOT EXISTS (
        SELECT 1 FROM exceptions e
        WHERE e.exception_type IN ('holiday', 'sick_leave', 'unavailable', 'training')
          AND (
            (e.start_time IS NULL) -- Full day exception
            OR (ts.slot_time >= e.start_time AND ts.slot_time < e.end_time)
          )
      )
  )
  SELECT 
    as_slots.slot_time,
    as_slots.slot_end_time,
    CASE 
      WHEN COUNT(a.id) = 0 THEN true 
      ELSE false 
    END as is_available,
    COUNT(a.id)::INTEGER as booking_count
  FROM available_slots as_slots
  LEFT JOIN hospitals_appointments a ON (
    a.employee_assignment_id = p_employee_assignment_id
    AND a.appointment_date = p_date
    AND a.appointment_time = as_slots.slot_time
    AND a.status NOT IN ('cancelled', 'completed')
  )
  GROUP BY as_slots.slot_time, as_slots.slot_end_time
  ORDER BY as_slots.slot_time;
END;
$$ LANGUAGE plpgsql;

-- 8. Function to validate appointment booking
CREATE OR REPLACE FUNCTION validate_employee_appointment_booking(
  p_entity_platform_id VARCHAR(255),
  p_employee_assignment_id UUID,
  p_appointment_date DATE,
  p_appointment_time TIME
)
RETURNS TABLE(
  is_valid BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_day_of_week INTEGER;
  v_is_working BOOLEAN := false;
  v_has_exception BOOLEAN := false;
  v_is_booked BOOLEAN := false;
  v_employee_active BOOLEAN := false;
BEGIN
  v_day_of_week := EXTRACT(DOW FROM p_appointment_date);
  
  -- Check if employee is active and rostering enabled
  SELECT (is_active AND rostering_enabled) INTO v_employee_active
  FROM employee_to_entity_role_assignment
  WHERE id = p_employee_assignment_id 
    AND entity_platform_id = p_entity_platform_id;
  
  IF NOT v_employee_active THEN
    RETURN QUERY SELECT false, 'Employee is not active or rostering is not enabled'::TEXT;
    RETURN;
  END IF;
  
  -- Check if employee is scheduled to work
  SELECT EXISTS(
    SELECT 1 FROM employee_weekly_schedule ews
    WHERE ews.employee_assignment_id = p_employee_assignment_id
      AND ews.day_of_week = v_day_of_week
      AND ews.is_active = true
      AND p_appointment_date >= ews.effective_from
      AND (ews.effective_until IS NULL OR p_appointment_date <= ews.effective_until)
      AND p_appointment_time >= ews.start_time
      AND p_appointment_time < ews.end_time
  ) INTO v_is_working;
  
  IF NOT v_is_working THEN
    RETURN QUERY SELECT false, 'Employee is not scheduled to work at this time'::TEXT;
    RETURN;
  END IF;
  
  -- Check for exceptions
  SELECT EXISTS(
    SELECT 1 FROM employee_schedule_exceptions ese
    WHERE ese.employee_assignment_id = p_employee_assignment_id
      AND ese.exception_date = p_appointment_date
      AND ese.exception_type IN ('holiday', 'sick_leave', 'unavailable', 'training')
      AND (
        ese.start_time IS NULL -- Full day exception
        OR (p_appointment_time >= ese.start_time AND p_appointment_time < ese.end_time)
      )
  ) INTO v_has_exception;
  
  IF v_has_exception THEN
    RETURN QUERY SELECT false, 'Employee is not available due to scheduled exception'::TEXT;
    RETURN;
  END IF;
  
  -- Check if slot is already booked
  SELECT EXISTS(
    SELECT 1 FROM hospital_master_appointments a
    WHERE a.employee_assignment_id = p_employee_assignment_id
      AND a.appointment_date = p_appointment_date
      AND a.appointment_time = p_appointment_time
      AND a.status NOT IN ('cancelled', 'completed')
  ) INTO v_is_booked;
  
  IF v_is_booked THEN
    RETURN QUERY SELECT false, 'This time slot is already booked'::TEXT;
    RETURN;
  END IF;
  
  -- All validations passed
  RETURN QUERY SELECT true, 'Appointment slot is available'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger to validate appointments and sync employee_id on insert/update
CREATE OR REPLACE FUNCTION check_employee_appointment_availability()
RETURNS TRIGGER AS $$
DECLARE
  v_validation RECORD;
  v_employee_record RECORD;
BEGIN
  IF NEW.employee_assignment_id IS NOT NULL THEN
    -- Validate the appointment
    SELECT * INTO v_validation 
    FROM validate_employee_appointment_booking(
      NEW.entity_platform_id,
      NEW.employee_assignment_id,
      NEW.appointment_date,
      NEW.appointment_time
    );
    
    IF NOT v_validation.is_valid THEN
      RAISE EXCEPTION 'Cannot book appointment: %', v_validation.error_message;
    END IF;
    
    -- Sync employee data for easier queries
    SELECT employee_id, user_platform_id INTO v_employee_record
    FROM employee_to_entity_role_assignment
    WHERE id = NEW.employee_assignment_id;
    
    NEW.employee_id := v_employee_record.employee_id;
    NEW.doctor_user_platform_id := v_employee_record.user_platform_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_employee_appointment_booking_trigger ON hospitals_appointments;

-- Create new trigger
CREATE TRIGGER validate_employee_appointment_booking_trigger
  BEFORE INSERT OR UPDATE ON hospitals_appointments
  FOR EACH ROW
  EXECUTE FUNCTION check_employee_appointment_availability();

-- 10. Function to get all employees available for appointments in an entity
CREATE OR REPLACE FUNCTION get_entity_appointment_staff(p_entity_platform_id VARCHAR(255))
RETURNS TABLE(
  employee_assignment_id UUID,
  employee_id VARCHAR(50),
  user_platform_id VARCHAR(255),
  full_name TEXT,
  employee_job_title VARCHAR(255),
  role_type VARCHAR(50),
  slot_duration_minutes INTEGER,
  professional_email VARCHAR(255),
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id as employee_assignment_id,
    e.employee_id,
    e.user_platform_id,
    CONCAT(p.first_name, ' ', p.last_name) as full_name,
    e.employee_job_title,
    e.role_type,
    e.slot_duration_minutes,
    e.professional_email,
    e.is_active
  FROM employee_to_entity_role_assignment e
  LEFT JOIN profiles p ON e.user_platform_id = p.user_platform_id
  WHERE e.entity_platform_id = p_entity_platform_id
    AND e.is_active = true
    AND e.is_approved = true
    AND e.rostering_enabled = true
    AND e.can_take_appointments = true
  ORDER BY e.employee_job_title, p.first_name, p.last_name;
END;
$$ LANGUAGE plpgsql;

-- 11. Sample data - Update existing records to enable rostering for veterinarians
UPDATE employee_to_entity_role_assignment 
SET 
  role_type = CASE 
    WHEN LOWER(employee_job_title) LIKE '%vet%' OR LOWER(employee_job_title) LIKE '%doctor%' THEN 'vet'
    WHEN LOWER(employee_job_title) LIKE '%nurse%' THEN 'nurse'
    WHEN LOWER(employee_job_title) LIKE '%groomer%' THEN 'groomer'
    WHEN LOWER(employee_job_title) LIKE '%receptionist%' THEN 'receptionist'
    ELSE 'staff'
  END,
  slot_duration_minutes = CASE 
    WHEN LOWER(employee_job_title) LIKE '%groomer%' THEN 30
    ELSE 15
  END,
  can_take_appointments = CASE 
    WHEN LOWER(employee_job_title) LIKE '%vet%' 
      OR LOWER(employee_job_title) LIKE '%doctor%' 
      OR LOWER(employee_job_title) LIKE '%nurse%' 
      OR LOWER(employee_job_title) LIKE '%groomer%' THEN true
    ELSE false
  END,
  rostering_enabled = CASE 
    WHEN LOWER(employee_job_title) LIKE '%vet%' 
      OR LOWER(employee_job_title) LIKE '%doctor%' 
      OR LOWER(employee_job_title) LIKE '%nurse%' 
      OR LOWER(employee_job_title) LIKE '%groomer%' THEN true
    ELSE false
  END
WHERE is_active = true;

-- Grant necessary permissions
GRANT ALL ON employee_weekly_schedule TO authenticated;
GRANT ALL ON employee_schedule_exceptions TO authenticated;
GRANT ALL ON time_slots TO authenticated;
GRANT EXECUTE ON FUNCTION get_employee_available_slots TO authenticated;
GRANT EXECUTE ON FUNCTION validate_employee_appointment_booking TO authenticated;
GRANT EXECUTE ON FUNCTION get_entity_appointment_staff TO authenticated;

-- Enable RLS on new tables
ALTER TABLE employee_weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_schedule_exceptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (assuming entity-based access control)
CREATE POLICY employee_schedule_entity_access ON employee_weekly_schedule
  FOR ALL USING (
    entity_platform_id IN (
      SELECT entity_platform_id FROM employee_to_entity_role_assignment 
      WHERE user_platform_id = (
        SELECT user_platform_id FROM profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY employee_exceptions_entity_access ON employee_schedule_exceptions
  FOR ALL USING (
    entity_platform_id IN (
      SELECT entity_platform_id FROM employee_to_entity_role_assignment 
      WHERE user_platform_id = (
        SELECT user_platform_id FROM profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Summary of Integration:
-- ✅ Uses existing employee_to_entity_role_assignment table as base
-- ✅ Adds rostering-specific fields (role_type, slot_duration, etc.)
-- ✅ Creates separate scheduling tables for weekly schedules and exceptions
-- ✅ Updates hospitals_appointments to link to employee records
-- ✅ Provides functions for slot availability and booking validation
-- ✅ Maintains multi-tenant security with RLS policies
-- ✅ Backward compatible with existing data structure