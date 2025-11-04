-- Allow Platform Admins to view all employee seat assignments
-- Currently users can only see their own seats, but admins should see all

-- Step 1: Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'employee_seat_assignment'
ORDER BY policyname;

-- Step 2: Check if user is platform admin function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%platform_admin%';

-- Step 3: Create helper function to check if user is platform admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_expertise_assignment uea
    JOIN platform_roles pr ON pr.id = uea.platform_role_id
    WHERE uea.user_id = auth.uid()
    AND pr.role_name IN ('platform_admin', 'super_admin')
    AND uea.is_active = true
  );
END;
$$;

-- Step 4: Add policy for platform admins to view all seats
CREATE POLICY "Platform admins can view all seats"
ON employee_seat_assignment
FOR SELECT
USING (is_platform_admin());

-- Step 5: Verify new policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'employee_seat_assignment'
ORDER BY policyname;

-- Step 6: Test query as admin
SELECT 
    unique_seat_id,
    employee_job_title,
    department,
    is_filled,
    is_active,
    employee_entity_id
FROM employee_seat_assignment
ORDER BY employee_job_title
LIMIT 10;
