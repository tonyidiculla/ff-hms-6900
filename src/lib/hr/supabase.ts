import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

// Create browser client for client-side operations
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Create admin client for server-side operations that require elevated privileges
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Get the hospital ID for a user (for HRMS context)
 * This function needs to be implemented based on your business logic
 */
export async function getUserHospitalId(userPlatformId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('employee_seat_assignment')
      .select('entity_platform_id')
      .eq('user_platform_id', userPlatformId)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    return data.entity_platform_id
  } catch (error) {
    console.error('Error getting user hospital ID:', error)
    return null
  }
}

