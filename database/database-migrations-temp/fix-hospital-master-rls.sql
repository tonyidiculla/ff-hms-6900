-- ============================================
-- ADD RLS POLICIES FOR HOSPITAL_MASTER
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable RLS on hospital_master (if not already enabled)
ALTER TABLE hospital_master ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON hospital_master;
DROP POLICY IF EXISTS "dev_all_anon" ON hospital_master;

-- Create a policy to allow all reads for development
CREATE POLICY "dev_all_anon" 
ON hospital_master
FOR SELECT
TO anon
USING (true);

-- Also allow authenticated users
CREATE POLICY "dev_all_authenticated" 
ON hospital_master
FOR SELECT
TO authenticated
USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'hospital_master';
