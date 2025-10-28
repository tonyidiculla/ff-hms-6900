-- ============================================
-- INSERT SAMPLE HOSPITAL DATA
-- Run this in Supabase SQL Editor if no hospital_master exist
-- ============================================

-- Insert sample hospital_master into hospital_master
INSERT INTO hospital_master (
  entity_name,
  entity_platform_id,
  organization_platform_id,
  city
) VALUES 
  ('Furfield Veterinary Hospital', 'E01000001', 'O01000001', 'New York'),
  ('Furfield Pet Clinic Downtown', 'E01000002', 'O01000001', 'Brooklyn'),
  ('Furfield Animal Care Center', 'E01000003', 'O01000001', 'Queens'),
  ('City Pet Hospital', 'E01000004', 'O01000002', 'Manhattan'),
  ('Downtown Veterinary Clinic', 'E01000005', 'O01000003', 'Boston')
ON CONFLICT (entity_platform_id) DO NOTHING;

-- Verify insertion
SELECT 
  entity_name,
  entity_platform_id,
  city,
  created_at
FROM hospital_master
ORDER BY created_at DESC;
