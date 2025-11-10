import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { secureError } from './secure-logging';

// Helper function to create server-side Supabase client
async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component running - ignoring cookie setting
          }
        },
      },
    }
  );
}

// Helper function to get user platform ID from user ID
async function getUserPlatformId(supabase: any, userId: string): Promise<string | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('user_platform_id')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    secureError('[Auth] Profile lookup failed', error, { userId });
    return null;
  }
  
  return profile?.user_platform_id || null;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  entity_platform_id?: string;
  user_platform_id: string;
  roles: string[];
}

export async function authenticateRequest(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Try Bearer token authentication first (direct HRMS access)
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return await authenticateWithBearerToken(authHeader.substring(7));
    }

    // Fallback to HMS gateway cookie authentication
    return await authenticateWithHMSGateway(request);

  } catch (error) {
    secureError('[Auth] Authentication error', error);
    return null;
  }
}

async function authenticateWithBearerToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    // Create server-side Supabase client
    const supabase = await createSupabaseServerClient();

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      secureError('[Auth] Bearer token verification failed', error);
      return null;
    }

    // Get user profile - query profiles table directly
    const userPlatformId = await getUserPlatformId(supabase, user.id);
    
    if (!userPlatformId) {
      return null;
    }

    // Get entity context and roles from employee seat assignment
    const { data: seatData } = await supabase
      .from('employee_seat_assignment')
      .select(`
        employee_entity_id,
        platform_role_name
      `)
      .eq('user_platform_id', userPlatformId)
      .eq('is_active', true)
      .eq('is_filled', true)
      .maybeSingle();

    const entity_platform_id = seatData?.employee_entity_id;

    // Get user roles for authorization from employee seat assignment
    // platform_role_name is now stored directly as text in the assignment table
    const roles = seatData?.platform_role_name ? [seatData.platform_role_name] : [];

    return {
      id: user.id,
      email: user.email!,
      entity_platform_id: entity_platform_id,
      user_platform_id: userPlatformId,
      roles
    };

  } catch (error) {
    secureError('[Auth] Bearer token authentication error', error);
    return null;
  }
}

async function authenticateWithHMSGateway(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Check if request is from HMS gateway proxy
    const isHMSGateway = request.headers.get('x-hms-gateway') === 'true';
    const hmsUserId = request.headers.get('x-hms-user-id');
    const hmsUserEmail = request.headers.get('x-hms-user-email');
    
    if (isHMSGateway && hmsUserId && hmsUserEmail) {
      console.log('[Auth] HMS Gateway request detected:', { hmsUserId, hmsUserEmail });
      
      // HMS gateway has already authenticated the user
      // Get user profile and roles from database
      const supabase = await createSupabaseServerClient();
      
      const userPlatformId = await getUserPlatformId(supabase, hmsUserId);

      // Get entity context from employee seat assignment  
      const { data: seatData } = await supabase
        .from('employee_seat_assignment')
        .select('employee_entity_id')
        .eq('user_id', hmsUserId)
        .eq('is_active', true)
        .single();

      const entity_platform_id = seatData?.employee_entity_id;

      if (!userPlatformId) {
        // Fallback to basic info from headers
        return {
          id: hmsUserId,
          email: hmsUserEmail,
          entity_platform_id: undefined,
          user_platform_id: hmsUserId,
          roles: ['employee'] // Default role
        };
      }

      // Get roles from employee seat assignment -> platform_roles
      const { data: empSeatData } = await supabase
        .from('employee_seat_assignment')
        .select(`
          platform_roles (
            role_value,
            privilege_level
          )
        `)
        .eq('user_platform_id', userPlatformId)
        .eq('is_active', true)
        .eq('is_filled', true)
        .maybeSingle();

      const empRoleData = empSeatData?.platform_roles as any;
      const roles = empRoleData?.role_value ? [empRoleData.role_value] : ['employee'];

      return {
        id: hmsUserId,
        email: hmsUserEmail,
        entity_platform_id: entity_platform_id,
        user_platform_id: userPlatformId,
        roles
      };
    }

    // If no HMS headers, try cookie-based session authentication
    const supabase = await createSupabaseServerClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }

    // Use session user data
    const userPlatformId = await getUserPlatformId(supabase, session.user.id);
    
    if (!userPlatformId) {
      return null;
    }

    // Get entity context and roles from employee seat assignment
    const { data: seatData } = await supabase
      .from('employee_seat_assignment')
      .select(`
        employee_entity_id,
        platform_roles (
          role_value,
          privilege_level
        )
      `)
      .eq('user_platform_id', userPlatformId)
      .eq('is_active', true)
      .eq('is_filled', true)
      .maybeSingle();

    const entity_platform_id = seatData?.employee_entity_id;

    // Get user roles for authorization from employee seat assignment -> platform_roles
    const sessionRoleData = seatData?.platform_roles as any;
    const roles = sessionRoleData?.role_value ? [sessionRoleData.role_value] : [];

    return {
      id: session.user.id,
      email: session.user.email!,
      entity_platform_id: entity_platform_id,
      user_platform_id: userPlatformId,
      roles
    };

  } catch (error) {
    secureError('[Auth] HMS gateway authentication error', error);
    return null;
  }
}

// Exception classes for clean error handling
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Consistent "throw on failure" helpers - no more mixed paradigms
export async function requireAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new AuthenticationError('Authentication required');
  }
  return user;
}

export async function requireUserWithRole(request: NextRequest, allowedRoles: string[]): Promise<AuthenticatedUser> {
  const user = await requireAuthenticatedUser(request);
  
  const hasRole = user.roles.some(role => allowedRoles.includes(role));
  if (!hasRole) {
    throw new AuthorizationError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
  }
  
  return user;
}

// Legacy helpers - kept for backward compatibility but deprecated
export function requireAuthentication() {
  return async (request: NextRequest) => {
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return user;
  };
}

export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest) => {
    const user = await authenticateRequest(request);
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const hasRole = user.roles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      return Response.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return user;
  };
}

/**
 * Create an audit log entry for compliance tracking
 * 
 * @param action - The action performed (CREATE, UPDATE, DELETE, etc.)
 * @param table - The table affected
 * @param recordId - The ID of the affected record
 * @param userId - The user who performed the action
 * @param changes - Optional change data
 * @param options - Configuration options
 * @returns Promise that resolves with data/error, or throws if failOnError is true
 */
export async function createAuditLog(
  action: string, 
  table: string, 
  recordId: string, 
  userId: string, 
  changes?: any,
  options: { failOnError?: boolean; context?: string } = {}
) {
  const { failOnError = false, context = 'unknown' } = options;
  
  try {
    // Use service role client for system audit logging to bypass RLS
    // This ensures audit logs are always written regardless of user permissions
    const { supabaseServer } = await import('./supabase-server');
    
    const { data, error } = await supabaseServer
      .from('audit_logs')
      .insert({
        action,
        table_name: table,
        record_id: recordId,
        user_id: userId,
        changes: changes || {},
        created_at: new Date().toISOString()
      });

    if (error) {
      const errorMessage = `[AuditLog] CRITICAL: Failed to create audit log for ${action} on ${table}:${recordId}`;
      secureError(errorMessage, error, {
        action,
        table,
        recordId,
        userId,
        context,
        timestamp: new Date().toISOString()
      });
      
      // For compliance-critical operations, you may want to fail the entire operation
      // if audit logging fails. Enable this with failOnError option.
      if (failOnError) {
        throw new Error(`Audit logging failed: ${error.message}. Operation cannot proceed without audit trail.`);
      }
      
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    const errorMessage = `[AuditLog] EXCEPTION: Audit logging system error`;
    secureError(errorMessage, err, {
      action,
      table,
      recordId,
      userId,
      context,
      timestamp: new Date().toISOString()
    });
    
    if (failOnError) {
      throw err;
    }
    
    return { data: null, error: err };
  }
}

/**
 * Wrapper for createAuditLog that automatically checks for errors and logs warnings
 * Use this in API routes where you want audit failures to be visible but not block operations
 * 
 * @example
 * await createAuditLogWithErrorCheck(
 *   'CREATE', 'training_programs', newProgram.id, user.id, programData,
 *   'TrainingPrograms POST'
 * );
 */
export async function createAuditLogWithErrorCheck(
  action: string,
  table: string,
  recordId: string,
  userId: string,
  changes?: any,
  context?: string
): Promise<void> {
  const result = await createAuditLog(action, table, recordId, userId, changes, { context });
  
  if (result.error) {
    console.warn(`[${context || 'API'}] Audit log failed but operation succeeded`, {
      action,
      table,
      recordId,
      auditError: result.error
    });
  }
}