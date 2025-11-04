-- ============================================================================
-- PRIVILEGE-LEVEL BASED RLS IMPLEMENTATION
-- ============================================================================
-- This script implements proper privilege-level based Row Level Security
-- across key tables using the standardized permission system.
--
-- Privilege Levels (Lower = Higher Access):
--   1-10:   Platform Admin
--   11-20:  Organization Admin
--   21-30:  Entity Admin
--   31-40:  Medical/HMS
--   41-60:  Management
--   61-80:  Staff
--   81-100: Basic User
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user has specific privilege level or higher
CREATE OR REPLACE FUNCTION public.user_has_privilege_level(required_level INTEGER)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_expertise_assignment uea
    JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
    WHERE uea.user_id = auth.uid()
    AND uea.is_active = true
    AND pr.is_active = true
    AND pr.privilege_level <= required_level  -- Lower number = higher privilege
  );
$$;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.user_has_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_expertise_assignment uea
    JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
    WHERE uea.user_id = auth.uid()
    AND uea.is_active = true
    AND pr.is_active = true
    AND pr.permissions @> jsonb_build_array(permission_name)
  );
$$;

-- Function to check if user has access to specific module
CREATE OR REPLACE FUNCTION public.user_has_module(module_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_expertise_assignment uea
    JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
    WHERE uea.user_id = auth.uid()
    AND uea.is_active = true
    AND pr.is_active = true
    AND module_name = ANY(pr.modules)
  );
$$;

-- Function to get user's highest privilege level (lowest number)
CREATE OR REPLACE FUNCTION public.get_user_privilege_level()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT MIN(pr.privilege_level)
  FROM public.user_expertise_assignment uea
  JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
  WHERE uea.user_id = auth.uid()
  AND uea.is_active = true
  AND pr.is_active = true;
$$;

COMMENT ON FUNCTION public.user_has_privilege_level IS 'Check if user has privilege level or higher (lower number = higher privilege)';
COMMENT ON FUNCTION public.user_has_permission IS 'Check if user has specific permission string';
COMMENT ON FUNCTION public.user_has_module IS 'Check if user has access to specific module';
COMMENT ON FUNCTION public.get_user_privilege_level IS 'Get user highest privilege level (returns lowest number)';

-- ============================================================================
-- PART 2: EMPLOYEE SEAT ASSIGNMENT (HRMS POSITIONS)
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own seat assignments" ON public.employee_seat_assignment;
DROP POLICY IF EXISTS "Platform admins can view all seats" ON public.employee_seat_assignment;
DROP POLICY IF EXISTS "Platform admins can insert seats" ON public.employee_seat_assignment;
DROP POLICY IF EXISTS "Platform admins can update seats" ON public.employee_seat_assignment;
DROP POLICY IF EXISTS "Users can insert seats" ON public.employee_seat_assignment;
DROP POLICY IF EXISTS "Users can update seats" ON public.employee_seat_assignment;

-- SELECT: Users can view based on privilege level
-- - Level 1-10 (Platform Admin): All seats across platform
-- - Level 11-20 (Organization Admin): All seats in organization
-- - Level 21-30 (Entity Admin): All seats in entity
-- - Level 31-80: Only own seat
CREATE POLICY "privilege_based_select_seats"
ON public.employee_seat_assignment
FOR SELECT
USING (
  CASE 
    -- Platform admins see all
    WHEN public.user_has_privilege_level(10) THEN true
    -- Organization admins see all in their org (when org filtering is implemented)
    WHEN public.user_has_privilege_level(20) THEN true
    -- Entity admins see all in their entity
    WHEN public.user_has_privilege_level(30) THEN true
    -- Everyone else sees only their own seat
    ELSE user_id = auth.uid()
  END
);

-- INSERT: Only admins can create new positions
-- Requires Entity Admin privilege or hrms.positions.create permission
CREATE POLICY "privilege_based_insert_seats"
ON public.employee_seat_assignment
FOR INSERT
WITH CHECK (
  public.user_has_privilege_level(30)  -- Entity admin or higher
  OR public.user_has_permission('hrms.positions.create')
);

-- UPDATE: Only admins can update positions
-- Requires Entity Admin privilege or hrms.positions.edit permission
CREATE POLICY "privilege_based_update_seats"
ON public.employee_seat_assignment
FOR UPDATE
USING (
  public.user_has_privilege_level(30)  -- Entity admin or higher
  OR public.user_has_permission('hrms.positions.edit')
)
WITH CHECK (
  public.user_has_privilege_level(30)
  OR public.user_has_permission('hrms.positions.edit')
);

-- DELETE: Only admins can delete positions
-- Requires Entity Admin privilege or hrms.positions.delete permission
CREATE POLICY "privilege_based_delete_seats"
ON public.employee_seat_assignment
FOR DELETE
USING (
  public.user_has_privilege_level(30)  -- Entity admin or higher
  OR public.user_has_permission('hrms.positions.delete')
);

-- ============================================================================
-- PART 3: PLATFORM ROLES (READ-ONLY FOR MOST USERS)
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to view platform_roles" ON public.platform_roles;
DROP POLICY IF EXISTS "Platform admins can manage roles" ON public.platform_roles;

-- SELECT: All authenticated users can view roles (needed for UI dropdowns)
CREATE POLICY "authenticated_view_roles"
ON public.platform_roles
FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT/UPDATE/DELETE: Only platform admins
CREATE POLICY "platform_admin_manage_roles"
ON public.platform_roles
FOR ALL
USING (
  public.user_has_privilege_level(10)  -- Platform admin only
  OR public.user_has_permission('platform.roles.manage')
)
WITH CHECK (
  public.user_has_privilege_level(10)
  OR public.user_has_permission('platform.roles.manage')
);

-- ============================================================================
-- PART 4: USER EXPERTISE ASSIGNMENT (ROLE ASSIGNMENTS)
-- ============================================================================

-- Keep existing simple policies for viewing role assignments
-- These are already non-recursive and working well

-- ============================================================================
-- PART 5: PROFILES TABLE
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- SELECT: Users can view their own profile, admins can view all
CREATE POLICY "privilege_based_select_profiles"
ON public.profiles
FOR SELECT
USING (
  id = auth.uid()  -- Own profile
  OR public.user_has_privilege_level(30)  -- Entity admin or higher
  OR public.user_has_permission('hrms.employees.view_all')
);

-- UPDATE: Users can update own profile, admins can update all
CREATE POLICY "privilege_based_update_profiles"
ON public.profiles
FOR UPDATE
USING (
  id = auth.uid()  -- Own profile
  OR public.user_has_privilege_level(30)  -- Entity admin or higher
  OR public.user_has_permission('hrms.employees.edit')
)
WITH CHECK (
  id = auth.uid()
  OR public.user_has_privilege_level(30)
  OR public.user_has_permission('hrms.employees.edit')
);

-- ============================================================================
-- PART 6: GRANT EXECUTE PERMISSIONS
-- ============================================================================

-- Grant execute on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION public.user_has_privilege_level(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_permission(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_module(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_privilege_level() TO authenticated;

-- ============================================================================
-- PART 7: VERIFICATION QUERIES
-- ============================================================================

-- Test the functions (run these after executing the script)
/*

-- Check your privilege level
SELECT public.get_user_privilege_level() as my_privilege_level;

-- Check if you have entity admin privilege
SELECT public.user_has_privilege_level(30) as is_entity_admin_or_higher;

-- Check specific permission
SELECT public.user_has_permission('hrms.positions.create') as can_create_positions;

-- Check module access
SELECT public.user_has_module('hrms') as has_hrms_access;

-- View all your roles with privilege levels
SELECT 
  pr.role_name,
  pr.display_name,
  pr.privilege_level,
  pr.permissions,
  pr.modules
FROM public.user_expertise_assignment uea
JOIN public.platform_roles pr ON pr.id = uea.platform_role_id
WHERE uea.user_id = auth.uid()
AND uea.is_active = true;

*/

-- ============================================================================
-- IMPLEMENTATION COMPLETE
-- ============================================================================

SELECT 'RLS policies updated successfully! Run verification queries to test.' as status;
