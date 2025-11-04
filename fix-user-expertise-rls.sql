-- Fix infinite recursion in user_expertise_assignment RLS policies
-- This is the same issue we had with employee_seat_assignment

-- Step 1: Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_expertise_assignment'
ORDER BY policyname;

-- Step 2: Drop ALL existing RLS policies (including old ones and our new ones)
DROP POLICY IF EXISTS "Users can view their own role assignments" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Admins can view all role assignments" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Platform admins can view all assignments" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Users can view assignments in their entity" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Entity admins can manage assignments" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Only admins can create/update/delete assignments" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Platform admins can view all expertise" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Users can view their own expertise" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Only admins can assign expertise" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Only admins can update expertise" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Only admins can delete expertise" ON user_expertise_assignment;
-- Drop our new policies too (in case they exist from previous run)
DROP POLICY IF EXISTS "Users can view their own role assignments by user_id" ON user_expertise_assignment;
DROP POLICY IF EXISTS "Users can view their own role assignments by platform_id" ON user_expertise_assignment;

-- Step 3: Create simple, non-recursive SELECT policies
-- Allow users to view their own role assignments by user_id (from auth)
CREATE POLICY "Users can view their own role assignments by user_id"
ON user_expertise_assignment
FOR SELECT
USING (user_id = auth.uid());

-- Allow users to view their own role assignments by user_platform_id
CREATE POLICY "Users can view their own role assignments by platform_id"
ON user_expertise_assignment
FOR SELECT
USING (
    user_platform_id IN (
        SELECT user_platform_id 
        FROM profiles 
        WHERE user_id = auth.uid()
    )
);

-- Step 4: Verify the new policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'user_expertise_assignment'
ORDER BY policyname;

-- Step 5: Test query (this should work now)
SELECT 
    uea.user_platform_id,
    uea.platform_role_id,
    uea.is_active,
    pr.role_name,
    pr.display_name
FROM user_expertise_assignment uea
JOIN platform_roles pr ON pr.id = uea.platform_role_id
WHERE uea.user_platform_id = 'H00000001'
AND uea.is_active = true;
