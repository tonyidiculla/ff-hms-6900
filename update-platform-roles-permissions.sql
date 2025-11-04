-- ============================================================================
-- UPDATE PLATFORM_ROLES WITH STANDARDIZED PERMISSIONS
-- ============================================================================
-- This script updates existing platform roles with standardized permissions
-- and privilege levels based on the PERMISSIONS_PRIVILEGE_MAPPING.md document
-- ============================================================================

-- ============================================================================
-- PART 1: BACKUP EXISTING DATA
-- ============================================================================

-- Create backup table
CREATE TABLE IF NOT EXISTS public.platform_roles_backup_20251101 AS
SELECT * FROM public.platform_roles;

SELECT COUNT(*) as backed_up_roles FROM public.platform_roles_backup_20251101;

-- ============================================================================
-- PART 2: UPDATE PRIVILEGE LEVELS
-- ============================================================================

-- Platform Administrator (Level 1)
UPDATE public.platform_roles
SET 
  privilege_level = 1,
  permissions = jsonb_build_array(
    -- Platform permissions
    'platform.settings.view',
    'platform.settings.edit',
    'platform.roles.manage',
    'platform.organizations.view_all',
    'platform.users.manage',
    'platform.logs.view',
    'platform.integrations.manage',
    'platform.subscriptions.manage',
    -- All other permissions (platform admin has full access)
    '*.view_all',
    '*.edit',
    '*.create',
    '*.delete',
    '*.export',
    '*.audit.view'
  ),
  modules = ARRAY[
    'platform_admin', 'organization', 'hms', 'hrms', 'financial', 
    'scheduling', 'pharmacy', 'purchasing', 'inpatient', 'outpatient',
    'operation_theater', 'analytics', 'diagnostics', 'chat', 'facilities'
  ]
WHERE role_name ILIKE '%platform%admin%' 
   OR role_name = 'super_admin';

-- Organization Administrator (Level 15)
UPDATE public.platform_roles
SET 
  privilege_level = 15,
  permissions = jsonb_build_array(
    -- Organization management
    'organization.edit',
    'organization.view',
    'organization.entity.create',
    'organization.entity.delete',
    'organization.users.manage',
    'organization.roles.assign',
    'organization.analytics.view',
    -- Cross-cutting org-wide access
    '*.view_organization',
    '*.export'
  ),
  modules = ARRAY[
    'organization', 'hms', 'hrms', 'financial', 'scheduling', 
    'analytics', 'operation_theater', 'chat'
  ]
WHERE role_name ILIKE '%organization%admin%';

-- Entity Administrator (Level 25)
UPDATE public.platform_roles
SET 
  privilege_level = 25,
  permissions = jsonb_build_array(
    -- Entity/facility management
    'organization.entity.edit',
    'organization.entity.view',
    -- HRMS full access
    'hrms.employees.create',
    'hrms.employees.edit',
    'hrms.employees.delete',
    'hrms.employees.view_all',
    'hrms.positions.create',
    'hrms.positions.edit',
    'hrms.positions.delete',
    'hrms.positions.view',
    'hrms.positions.assign',
    'hrms.payroll.manage',
    'hrms.payroll.view_all',
    -- Financial management
    'financial.invoices.delete',
    'financial.payments.refund',
    'financial.reports.view',
    'financial.data.export',
    'financial.accounts.manage',
    'financial.ledger.view',
    -- Cross-cutting entity-wide access
    '*.view_entity',
    '*.audit.view',
    '*.export'
  ),
  modules = ARRAY[
    'organization', 'hrms', 'hms', 'financial', 'scheduling', 
    'operation_theater', 'analytics', 'facilities', 'chat'
  ]
WHERE role_name ILIKE '%entity%admin%'
   OR role_name ILIKE '%department%admin%';

-- Medical Director (Level 30)
UPDATE public.platform_roles
SET 
  privilege_level = 30,
  permissions = jsonb_build_array(
    -- Medical oversight
    'hms.patients.manage',
    'hms.patients.view',
    'hms.records.view',
    'hms.appointments.view',
    'hms.admissions.view',
    'inpatient.admissions.view',
    'outpatient.consultations.view',
    'diagnostics.labs.view',
    'diagnostics.imaging.view',
    -- Some entity admin capabilities
    '*.view_entity',
    'analytics.reports.view_standard'
  ),
  modules = ARRAY[
    'hms', 'inpatient', 'outpatient', 'diagnostics', 'operation_theater', 'analytics'
  ]
WHERE role_name ILIKE '%medical%director%'
   OR role_name ILIKE '%clinical%director%';

-- Doctor/Veterinarian (Level 35)
UPDATE public.platform_roles
SET 
  privilege_level = 35,
  permissions = jsonb_build_array(
    -- Clinical operations
    'hms.patients.manage',
    'hms.patients.view',
    'hms.records.create',
    'hms.records.edit',
    'hms.records.view',
    'hms.appointments.create',
    'hms.appointments.edit',
    'hms.appointments.cancel',
    'hms.prescriptions.create',
    'hms.prescriptions.view',
    'hms.admissions.manage',
    -- Inpatient
    'inpatient.admissions.create',
    'inpatient.discharges.process',
    'inpatient.transfers.process',
    'inpatient.notes.create',
    'inpatient.notes.view',
    -- Outpatient
    'outpatient.consultations.create',
    'outpatient.consultations.view',
    -- Diagnostics
    'diagnostics.labs.order',
    'diagnostics.labs.view',
    'diagnostics.imaging.order',
    'diagnostics.imaging.view'
  ),
  modules = ARRAY[
    'hms', 'inpatient', 'outpatient', 'diagnostics', 'operation_theater', 'pharmacy', 'chat'
  ]
WHERE role_name ILIKE '%doctor%'
   OR role_name ILIKE '%veterinarian%'
   OR role_name ILIKE '%physician%'
   OR role_name ILIKE '%surgeon%';

-- Nurse/Medical Staff (Level 40)
UPDATE public.platform_roles
SET 
  privilege_level = 40,
  permissions = jsonb_build_array(
    -- Patient care
    'hms.patients.view',
    'hms.appointments.view',
    'hms.appointments.cancel',
    'hms.records.view',
    'hms.prescriptions.view',
    'hms.admissions.view',
    'inpatient.admissions.view',
    'inpatient.notes.create',
    'inpatient.notes.view',
    'inpatient.beds.view',
    'outpatient.consultations.view',
    'diagnostics.labs.view',
    'pharmacy.medications.dispense'
  ),
  modules = ARRAY[
    'hms', 'inpatient', 'outpatient', 'pharmacy', 'diagnostics', 'chat'
  ]
WHERE role_name ILIKE '%nurse%'
   OR role_name ILIKE '%medical%staff%';

-- Department Manager (Level 50)
UPDATE public.platform_roles
SET 
  privilege_level = 50,
  permissions = jsonb_build_array(
    -- Team management
    'hrms.positions.view',
    'hrms.attendance.manage',
    'hrms.leave.approve',
    'hrms.leave.view',
    'scheduling.schedules.create',
    'scheduling.schedules.edit',
    'scheduling.schedules.view_all',
    'scheduling.shifts.assign',
    'scheduling.shifts.approve_swap',
    -- Operations
    'operations.tasks.assign',
    'operations.workflows.view',
    -- View access
    '*.view_team',
    'analytics.reports.view_standard'
  ),
  modules = ARRAY[
    'hrms', 'scheduling', 'analytics', 'chat'
  ]
WHERE role_name ILIKE '%manager%'
   OR role_name ILIKE '%supervisor%';

-- Pharmacist (Level 60)
UPDATE public.platform_roles
SET 
  privilege_level = 60,
  permissions = jsonb_build_array(
    'pharmacy.dashboard.view',
    'pharmacy.medications.dispense',
    'pharmacy.inventory.manage',
    'pharmacy.inventory.view',
    'pharmacy.orders.create',
    'pharmacy.orders.view',
    'pharmacy.interactions.view',
    'hms.prescriptions.view'
  ),
  modules = ARRAY['pharmacy', 'hms', 'chat']
WHERE role_name ILIKE '%pharmacist%';

-- Front Desk (Level 70)
UPDATE public.platform_roles
SET 
  privilege_level = 70,
  permissions = jsonb_build_array(
    'outpatient.registration.create',
    'outpatient.checkin.process',
    'outpatient.queue.view',
    'hms.appointments.create',
    'hms.appointments.edit',
    'hms.appointments.view',
    'hms.patients.view',
    'scheduling.schedules.view_own'
  ),
  modules = ARRAY['outpatient', 'hms', 'scheduling', 'chat']
WHERE role_name ILIKE '%front%desk%'
   OR role_name ILIKE '%reception%';

-- Staff Member (Level 80)
UPDATE public.platform_roles
SET 
  privilege_level = 80,
  permissions = jsonb_build_array(
    '*.view_own',
    'hrms.employees.view_own',
    'hrms.leave.request',
    'hrms.payroll.view_own',
    'scheduling.schedules.view_own',
    'scheduling.shifts.swap',
    'chat.access',
    'chat.direct.send',
    'chat.history.view'
  ),
  modules = ARRAY['chat', 'hrms', 'scheduling']
WHERE role_name ILIKE '%staff%'
   OR role_name ILIKE '%employee%';

-- ============================================================================
-- PART 3: ENSURE ALL ROLES HAVE PROPER STRUCTURE
-- ============================================================================

-- Ensure permissions is JSONB array format (not object)
UPDATE public.platform_roles
SET permissions = '[]'::jsonb
WHERE permissions IS NULL 
   OR jsonb_typeof(permissions) = 'null'
   OR jsonb_typeof(permissions) = 'object';

-- Ensure modules is text array
UPDATE public.platform_roles
SET modules = ARRAY[]::TEXT[]
WHERE modules IS NULL;

-- Ensure privilege_level is set (default to 100 for undefined)
UPDATE public.platform_roles
SET privilege_level = 100
WHERE privilege_level IS NULL;

-- ============================================================================
-- PART 4: VERIFICATION QUERIES
-- ============================================================================

-- View updated roles
SELECT 
  role_name,
  display_name,
  privilege_level,
  jsonb_array_length(permissions) as permission_count,
  array_length(modules, 1) as module_count,
  is_active
FROM public.platform_roles
ORDER BY privilege_level ASC, role_name;

-- Check for roles missing permissions
SELECT 
  role_name,
  privilege_level,
  CASE 
    WHEN permissions IS NULL THEN 'NULL'
    WHEN jsonb_array_length(permissions) = 0 THEN 'EMPTY'
    ELSE 'OK'
  END as permissions_status,
  CASE
    WHEN modules IS NULL THEN 'NULL'
    WHEN array_length(modules, 1) IS NULL THEN 'EMPTY'
    ELSE 'OK'
  END as modules_status
FROM public.platform_roles
WHERE jsonb_array_length(permissions) = 0 
   OR array_length(modules, 1) IS NULL
ORDER BY privilege_level;

-- ============================================================================
-- IMPLEMENTATION COMPLETE
-- ============================================================================

SELECT 
  COUNT(*) as total_roles,
  COUNT(*) FILTER (WHERE privilege_level <= 10) as platform_admins,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 11 AND 20) as org_admins,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 21 AND 30) as entity_admins,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 31 AND 40) as medical_staff,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 41 AND 60) as management,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 61 AND 80) as staff,
  COUNT(*) FILTER (WHERE privilege_level BETWEEN 81 AND 100) as basic_users
FROM public.platform_roles
WHERE is_active = true;
