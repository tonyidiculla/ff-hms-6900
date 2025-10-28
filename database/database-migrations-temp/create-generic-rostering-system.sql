-- Generic Rostering System for Multi-Tenant Staff Scheduling
-- This system can handle vets, nurses, groomers, and any other staff types

-- 1. Staff Roles Table (defines what types of staff each entity can have)
CREATE TABLE staff_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  role_code VARCHAR(50) NOT NULL, -- 'vet', 'nurse', 'groomer', 'receptionist', etc.
  role_name VARCHAR(100) NOT NULL, -- 'Veterinarian', 'Veterinary Nurse', 'Pet Groomer', etc.
  role_description TEXT,
  slot_duration_minutes INTEGER DEFAULT 15, -- Different roles may have different slot durations
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(entity_id, role_code)
);

-- 2. Staff Members Table (links platform users to entity roles)
CREATE TABLE staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  user_platform_id VARCHAR(255) NOT NULL, -- From auth system
  employee_id VARCHAR(50), -- Entity-assigned ID (optional, human-readable)
  role_id UUID REFERENCES staff_roles(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(entity_id, user_platform_id),
  UNIQUE(entity_id, employee_id) -- Employee ID must be unique within entity
);

-- 3. Standard Time Slots (15-minute intervals, can be customized per role)
CREATE TABLE time_slots (
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
) AS time_val;

-- 4. Staff Roster/Schedule (defines when staff members are available)
CREATE TABLE rostering (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  staff_member_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
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

-- 5. Roster Exceptions (holidays, sick days, special hours)
CREATE TABLE roster_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  staff_member_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  exception_type VARCHAR(50) NOT NULL, -- 'holiday', 'sick_leave', 'special_hours', 'unavailable'
  start_time TIME, -- NULL for full day exceptions
  end_time TIME, -- NULL for full day exceptions
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(staff_member_id, exception_date, start_time)
);

-- 6. Update appointments table to work with rostering
ALTER TABLE appointments 
ADD COLUMN staff_member_id UUID REFERENCES staff_members(id),
ADD COLUMN employee_id VARCHAR(50); -- Denormalized for easier queries

-- Create index for performance
CREATE INDEX idx_appointments_staff_member ON appointments(staff_member_id);
CREATE INDEX idx_appointments_employee_id ON appointments(entity_id, employee_id);
CREATE INDEX idx_rostering_staff_schedule ON rostering(staff_member_id, day_of_week, is_active);
CREATE INDEX idx_staff_members_entity_role ON staff_members(entity_id, role_id, is_active);

-- 7. Function to get available slots for a staff member on a specific date
CREATE OR REPLACE FUNCTION get_available_slots(
  p_entity_id UUID,
  p_staff_member_id UUID,
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
  
  -- Get slot duration for this staff member's role
  SELECT sr.slot_duration_minutes INTO v_slot_duration
  FROM staff_members sm
  JOIN staff_roles sr ON sm.role_id = sr.id
  WHERE sm.id = p_staff_member_id;
  
  v_slot_duration := COALESCE(v_slot_duration, 15); -- Default to 15 minutes
  
  RETURN QUERY
  WITH staff_schedule AS (
    -- Get the staff member's regular schedule for this day
    SELECT r.start_time, r.end_time
    FROM rostering r
    WHERE r.staff_member_id = p_staff_member_id
      AND r.day_of_week = v_day_of_week
      AND r.is_active = true
      AND p_date >= r.effective_from
      AND (r.effective_until IS NULL OR p_date <= r.effective_until)
  ),
  exceptions AS (
    -- Check for any exceptions on this date
    SELECT re.start_time, re.end_time, re.exception_type
    FROM roster_exceptions re
    WHERE re.staff_member_id = p_staff_member_id
      AND re.exception_date = p_date
  ),
  available_slots AS (
    SELECT 
      ts.slot_time,
      ts.slot_end_time
    FROM time_slots ts
    CROSS JOIN staff_schedule ss
    WHERE ts.duration_minutes = v_slot_duration
      AND ts.slot_time >= ss.start_time
      AND ts.slot_end_time <= ss.end_time
      -- Exclude exception periods
      AND NOT EXISTS (
        SELECT 1 FROM exceptions e
        WHERE e.exception_type IN ('holiday', 'sick_leave', 'unavailable')
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
  LEFT JOIN appointments a ON (
    a.staff_member_id = p_staff_member_id
    AND a.appointment_date = p_date
    AND a.appointment_time = as_slots.slot_time
    AND a.status NOT IN ('cancelled', 'completed')
  )
  GROUP BY as_slots.slot_time, as_slots.slot_end_time
  ORDER BY as_slots.slot_time;
END;
$$ LANGUAGE plpgsql;

-- 8. Function to validate appointment booking
CREATE OR REPLACE FUNCTION validate_appointment_booking(
  p_entity_id UUID,
  p_staff_member_id UUID,
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
BEGIN
  v_day_of_week := EXTRACT(DOW FROM p_appointment_date);
  
  -- Check if staff member is scheduled to work
  SELECT EXISTS(
    SELECT 1 FROM rostering r
    WHERE r.staff_member_id = p_staff_member_id
      AND r.day_of_week = v_day_of_week
      AND r.is_active = true
      AND p_appointment_date >= r.effective_from
      AND (r.effective_until IS NULL OR p_appointment_date <= r.effective_until)
      AND p_appointment_time >= r.start_time
      AND p_appointment_time < r.end_time
  ) INTO v_is_working;
  
  IF NOT v_is_working THEN
    RETURN QUERY SELECT false, 'Staff member is not scheduled to work at this time';
    RETURN;
  END IF;
  
  -- Check for exceptions
  SELECT EXISTS(
    SELECT 1 FROM roster_exceptions re
    WHERE re.staff_member_id = p_staff_member_id
      AND re.exception_date = p_appointment_date
      AND re.exception_type IN ('holiday', 'sick_leave', 'unavailable')
      AND (
        re.start_time IS NULL -- Full day exception
        OR (p_appointment_time >= re.start_time AND p_appointment_time < re.end_time)
      )
  ) INTO v_has_exception;
  
  IF v_has_exception THEN
    RETURN QUERY SELECT false, 'Staff member is not available due to scheduled exception';
    RETURN;
  END IF;
  
  -- Check if slot is already booked
  SELECT EXISTS(
    SELECT 1 FROM appointments a
    WHERE a.staff_member_id = p_staff_member_id
      AND a.appointment_date = p_appointment_date
      AND a.appointment_time = p_appointment_time
      AND a.status NOT IN ('cancelled', 'completed')
  ) INTO v_is_booked;
  
  IF v_is_booked THEN
    RETURN QUERY SELECT false, 'This time slot is already booked';
    RETURN;
  END IF;
  
  -- All validations passed
  RETURN QUERY SELECT true, 'Appointment slot is available'::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger to validate appointments on insert/update
CREATE OR REPLACE FUNCTION check_appointment_availability()
RETURNS TRIGGER AS $$
DECLARE
  v_validation RECORD;
BEGIN
  IF NEW.staff_member_id IS NOT NULL THEN
    SELECT * INTO v_validation 
    FROM validate_appointment_booking(
      NEW.entity_id,
      NEW.staff_member_id,
      NEW.appointment_date,
      NEW.appointment_time
    );
    
    IF NOT v_validation.is_valid THEN
      RAISE EXCEPTION 'Cannot book appointment: %', v_validation.error_message;
    END IF;
    
    -- Update employee_id for easier queries
    SELECT employee_id INTO NEW.employee_id
    FROM staff_members
    WHERE id = NEW.staff_member_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_appointment_booking_trigger
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION check_appointment_availability();

-- 10. Insert some default staff roles for veterinary clinics
INSERT INTO staff_roles (entity_id, role_code, role_name, role_description, slot_duration_minutes)
SELECT 
  e.id,
  role_data.role_code,
  role_data.role_name,
  role_data.role_description,
  role_data.slot_duration_minutes
FROM entities e
CROSS JOIN (
  VALUES 
    ('vet', 'Veterinarian', 'Licensed veterinarian providing medical care', 15),
    ('nurse', 'Veterinary Nurse', 'Veterinary nurse assisting with procedures', 15),
    ('groomer', 'Pet Groomer', 'Professional pet grooming services', 30),
    ('receptionist', 'Receptionist', 'Front desk and administrative support', 15),
    ('tech', 'Veterinary Technician', 'Veterinary technician for specialized procedures', 15)
) AS role_data(role_code, role_name, role_description, slot_duration_minutes)
WHERE e.type = 'veterinary'; -- Only add to vet clinics

-- Add RLS policies for multi-tenancy
ALTER TABLE staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rostering ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_exceptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (assuming you have entity-based access control)
CREATE POLICY staff_roles_entity_access ON staff_roles
  FOR ALL USING (
    entity_id IN (
      SELECT entity_id FROM user_entity_access 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY staff_members_entity_access ON staff_members
  FOR ALL USING (
    entity_id IN (
      SELECT entity_id FROM user_entity_access 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY rostering_entity_access ON rostering
  FOR ALL USING (
    entity_id IN (
      SELECT entity_id FROM user_entity_access 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY roster_exceptions_entity_access ON roster_exceptions
  FOR ALL USING (
    entity_id IN (
      SELECT entity_id FROM user_entity_access 
      WHERE user_id = auth.uid()
    )
  );

-- Grant necessary permissions
GRANT ALL ON staff_roles TO authenticated;
GRANT ALL ON staff_members TO authenticated;
GRANT ALL ON time_slots TO authenticated;
GRANT ALL ON rostering TO authenticated;
GRANT ALL ON roster_exceptions TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_slots TO authenticated;
GRANT EXECUTE ON FUNCTION validate_appointment_booking TO authenticated;