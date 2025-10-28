-- Appointments Schema with EMR Access Control
-- This implements the pet owner consent workflow

-- Main appointments table
CREATE TABLE IF NOT EXISTS hospitals_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_number TEXT UNIQUE, -- Human-readable ID
  
  -- Pet and owner
  pet_id UUID NOT NULL,
  pet_platform_id TEXT NOT NULL, -- A01xxxxxx
  owner_id UUID NOT NULL,
  owner_platform_id TEXT NOT NULL, -- H00xxxxxx
  
  -- Hospital and doctor
  hospital_id UUID NOT NULL,
  doctor_id UUID,
  doctor_platform_id TEXT,
  
  -- Appointment details
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  appointment_type TEXT, -- routine, emergency, follow-up, vaccination
  status TEXT DEFAULT 'scheduled', -- scheduled, confirmed, in-progress, completed, cancelled, no-show
  reason TEXT,
  notes TEXT,
  
  -- EMR Access Control
  emr_access_granted BOOLEAN DEFAULT false,
  emr_access_otp TEXT, -- OTP for granting access
  emr_access_granted_at TIMESTAMPTZ,
  emr_access_expires_at TIMESTAMPTZ,
  emr_write_access_revoked_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pet Medical Record Access Control
-- Tracks which hospital_master have access to which pet records
CREATE TABLE IF NOT EXISTS pet_emr_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Pet
  pet_id UUID NOT NULL,
  pet_platform_id TEXT NOT NULL,
  
  -- Hospital/Entity
  hospital_id UUID NOT NULL,
  hospital_platform_id TEXT,
  
  -- Access details
  appointment_id UUID, -- If linked to a specific appointment
  access_type TEXT NOT NULL, -- 'read-only' or 'read-write'
  granted_by UUID NOT NULL, -- Owner who granted access
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- OTP verification
  otp_code TEXT,
  otp_verified BOOLEAN DEFAULT false,
  otp_verified_at TIMESTAMPTZ,
  
  -- Revocation
  is_active BOOLEAN DEFAULT true,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID,
  revocation_reason TEXT,
  
  -- Write access control (for consultations)
  write_access_active BOOLEAN DEFAULT false,
  write_access_started_at TIMESTAMPTZ,
  write_access_ended_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_pet ON hospitals_appointments(pet_id);
CREATE INDEX IF NOT EXISTS idx_appointments_owner ON hospitals_appointments(owner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_hospital ON hospitals_appointments(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON hospitals_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON hospitals_appointments(status);

CREATE INDEX IF NOT EXISTS idx_emr_access_pet ON pet_emr_access(pet_id);
CREATE INDEX IF NOT EXISTS idx_emr_access_hospital ON pet_emr_access(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emr_access_active ON pet_emr_access(is_active);
CREATE INDEX IF NOT EXISTS idx_emr_access_appointment ON pet_emr_access(appointment_id);

-- RLS Policies
ALTER TABLE hospitals_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_emr_access ENABLE ROW LEVEL SECURITY;

-- Allow all for development (replace with proper policies in production)
CREATE POLICY "dev_all_anon_appointments" ON hospitals_appointments FOR ALL USING (true);
CREATE POLICY "dev_all_anon_emr_access" ON pet_emr_access FOR ALL USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON hospitals_appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emr_access_updated_at BEFORE UPDATE ON pet_emr_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
