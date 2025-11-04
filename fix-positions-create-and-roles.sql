-- Fix two issues:
-- 1. Platform roles not loading in dropdown
-- 2. Cannot create new positions (INSERT blocked)

-- ============================================================================
-- PART 1: Fix platform_roles table access
-- ============================================================================

-- Step 1: Check current policies on platform_roles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'platform_roles'
ORDER BY policyname;

-- Step 2: Enable RLS on platform_roles if not already enabled
ALTER TABLE platform_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Allow all authenticated users to view platform roles
DROP POLICY IF EXISTS "Anyone can view platform roles" ON platform_roles;
CREATE POLICY "Anyone can view platform roles"
ON platform_roles
FOR SELECT
TO authenticated
USING (true);

-- Step 4: Test platform_roles query
SELECT id, role_name, display_name
FROM platform_roles
ORDER BY role_name
LIMIT 5;

-- ============================================================================
-- PART 2: Fix employee_seat_assignment INSERT permissions
-- ============================================================================

-- Step 5: Create helper function to check if user has admin privileges
-- This function uses SECURITY DEFINER to bypass RLS on user_expertise_assignment
CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_expertise_assignment uea
    JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
    WHERE uea.user_id = auth.uid()
    AND pr.role_name IN ('platform_admin', 'super_admin', 'organization_admin', 'entity_admin')
    AND uea.is_active = true
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_admin_role() TO authenticated;

-- Test the function (should return true for you)
SELECT public.has_admin_role() as am_i_admin;

-- Step 6: Check current INSERT policies on employee_seat_assignment
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'employee_seat_assignment'
AND cmd IN ('INSERT', 'UPDATE')
ORDER BY cmd, policyname;

-- Step 7: Create INSERT policy - only users with admin roles can create seats
DROP POLICY IF EXISTS "Platform admins can create seats" ON employee_seat_assignment;
DROP POLICY IF EXISTS "Authenticated users can create seats" ON employee_seat_assignment;
DROP POLICY IF EXISTS "Admins can create seats" ON employee_seat_assignment;
CREATE POLICY "Admins can create seats"
ON employee_seat_assignment
FOR INSERT
TO authenticated
WITH CHECK (public.has_admin_role());

-- Step 8: Create UPDATE policy - only users with admin roles can update seats
DROP POLICY IF EXISTS "Platform admins can update seats" ON employee_seat_assignment;
DROP POLICY IF EXISTS "Authenticated users can update seats" ON employee_seat_assignment;
DROP POLICY IF EXISTS "Admins can update seats" ON employee_seat_assignment;
CREATE POLICY "Admins can update seats"
ON employee_seat_assignment
FOR UPDATE
TO authenticated
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

-- Step 8: Verify all policies on employee_seat_assignment
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'employee_seat_assignment'
ORDER BY cmd, policyname;

-- Step 9: Test if you can query platform_roles
SELECT COUNT(*) as total_roles FROM platform_roles;
