import { createClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client for API routes
 * 
 * CRITICAL: This client is configured for server-side execution only.
 * - Uses service role key for admin operations
 * - No browser storage dependencies
 * - Bypasses RLS when needed for system operations
 * - Should NOT be used in browser/client-side code
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Server-side Supabase client with RLS enforcement
 * 
 * Uses anon key but configured for server execution.
 * Suitable for operations that should respect RLS policies.
 */
export const supabaseServerRLS = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Creates an authenticated server-side Supabase client with user context
 * 
 * This client respects RLS policies and operates under the authenticated user's permissions.
 * Use this when you need database operations to respect user-level security.
 * 
 * @param token - The user's access token from Authorization header
 * @returns Supabase client configured with user context and RLS enforcement
 */
export function createAuthenticatedServerClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );
}

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY not found - admin operations will not work');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}