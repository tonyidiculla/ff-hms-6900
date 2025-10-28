import { supabaseClientManager } from './supabase-manager';

// Types for dual role system
interface UserRoles {
  platformRoles: string[];
  entityRoles: string[];
  hospitalId: string | null;
}

interface ProfileBasic {
  user_platform_id: string;
}

interface RoleAssignment {
  entity_platform_id: string;
  employee_entity_id?: string;
}

// Get the HMS Gateway proxy client with proper isolation
export const supabase = supabaseClientManager.getClient({
  serviceName: 'ff-hms-6900',
  storageKey: 'supabase.auth.gateway',
  options: {
  },
});

// Admin client for API routes (server-side only)
export const supabaseAdmin = supabaseClientManager.getClient({
  serviceName: 'ff-hms-6900-admin',
  storageKey: 'supabase.admin',
  options: {
    auth: {
      persistSession: false,
    },
  },
});

// Helper functions for ff-hms-6900 - Updated for dual role system

/**
 * Get user's hospital context using the dual role system
 * Hospital staff are identified through employee_to_entity_role_assignment
 * Hospital ID is referenced through entity_platform_id in hospital_master table
 */
export async function getUserHospitalId(userId: string): Promise<string | null> {
  try {
    // First get the user's platform ID from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_platform_id')
      .eq('id', userId)
      .single() as { data: ProfileBasic | null; error: any };
      
    if (profileError || !profile?.user_platform_id) {
      console.error('[ff-hms-6900] Error fetching user profile:', profileError);
      return null;
    }

    // Get hospital assignment through employee_to_entity_role_assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('employee_to_entity_role_assignment')
      .select('entity_platform_id')
      .eq('user_platform_id', profile.user_platform_id)
      .eq('is_active', true)
      .single() as { data: RoleAssignment | null; error: any };
      
    if (assignmentError || !assignment?.entity_platform_id) {
      console.error('[ff-hms-6900] Error fetching hospital assignment:', assignmentError);
      return null;
    }
    
    return assignment.entity_platform_id;
  } catch (error) {
    console.error('[ff-hms-6900] Error in getUserHospitalId:', error);
    return null;
  }
}

/**
 * Get user's role assignments within their hospital context
 * Uses the dual role system: platform roles + entity-specific employee roles
 */
export async function getUserRoles(userId: string): Promise<UserRoles | null> {
  try {
    // Get user platform ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_platform_id')
      .eq('id', userId)
      .single();
      
    if (profileError || !profile?.user_platform_id) {
      console.error('[ff-hms-6900] Error fetching user profile:', profileError);
      return null;
    }

    // Get platform-wide roles
    const { data: platformRoleAssignments, error: platformError } = await supabase
      .from('user_to_role_assignment')
      .select(`
        platform_roles!inner(role_name)
      `)
      .eq('user_platform_id', profile.user_platform_id)
      .eq('is_active', true);

    // Get entity-specific employee roles and hospital context
    const { data: entityRoleAssignments, error: entityError } = await supabase
      .from('employee_to_entity_role_assignment')
      .select(`
        entity_platform_id,
        platform_roles!inner(role_name)
      `)
      .eq('user_platform_id', profile.user_platform_id)
      .eq('is_active', true);

    if (platformError || entityError) {
      console.error('[ff-hms-6900] Error fetching roles:', { platformError, entityError });
      return null;
    }

    const hospitalId = entityRoleAssignments?.[0]?.entity_platform_id || null;
    
    return {
      platformRoles: platformRoleAssignments?.map((assignment: any) => assignment.platform_roles.role_name) || [],
      entityRoles: entityRoleAssignments?.map((assignment: any) => assignment.platform_roles.role_name) || [],
      hospitalId
    };
  } catch (error) {
    console.error('[ff-hms-6900] Error in getUserRoles:', error);
    return null;
  }
}

/**
 * Get hospital staff identity using employee_entity_id from dual role system
 * This is how hospital staff should be identified according to the HLD
 */
export async function getStaffEmployeeId(userId: string): Promise<string | null> {
  try {
    // Get user platform ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_platform_id')
      .eq('id', userId)
      .single();
      
    if (profileError || !profile?.user_platform_id) {
      console.error('[ff-hms-6900] Error fetching user profile:', profileError);
      return null;
    }

    // Get employee_entity_id from employee_to_entity_role_assignment
    const { data: assignment, error: assignmentError } = await supabase
      .from('employee_to_entity_role_assignment')
      .select('employee_entity_id')
      .eq('user_platform_id', profile.user_platform_id)
      .eq('is_active', true)
      .single();
      
    if (assignmentError || !assignment?.employee_entity_id) {
      console.error('[ff-hms-6900] Error fetching employee assignment:', assignmentError);
      return null;
    }
    
    return assignment.employee_entity_id;
  } catch (error) {
    console.error('[ff-hms-6900] Error in getStaffEmployeeId:', error);
    return null;
  }
}

/**
 * Validate that a user has access to a specific hospital
 * Uses the dual role system for proper hospital-based access control
 */
export async function validateHospitalAccess(userId: string, requiredHospitalId: string): Promise<boolean> {
  try {
    const userHospitalId = await getUserHospitalId(userId);
    return userHospitalId === requiredHospitalId;
  } catch (error) {
    console.error('[ff-hms-6900] Error validating hospital access:', error);
    return false;
  }
}







// Export manager for cross-service coordination
export { supabaseClientManager };

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  console.log(`[ff-hms-6900] Client manager active with ${supabaseClientManager.getClientCount()} total clients`);
}