import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { extractStorageUrl } from '@/lib/storage-service';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Create Supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log('[Auth API] No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('[Auth API] Session user:', session.user.email);

    // Get user profile from database (user_id is the PRIMARY KEY)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profileError) {
      console.error('[Auth API] Profile fetch error:', profileError);
    }

    console.log('[Auth API] Profile data:', profile);

    // Get user's actual role from platform_roles via user_expertise_assignment
    let userRole = 'User';
    let privilegeLevel: number | null = null;
    let jobTitle: string | null = null;
    
    if (profile?.user_platform_id) {
      console.log('[Auth API] Fetching role for user_platform_id:', profile.user_platform_id);
      
      // Get job title from employee_seat_assignment
      const { data: seatAssignment, error: seatError } = await supabase
        .from('employee_seat_assignment')
        .select('employee_job_title, platform_role_id, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single();

      console.log('[Auth API] Seat assignment:', { seatAssignment, seatError });

      if (seatAssignment?.employee_job_title) {
        jobTitle = seatAssignment.employee_job_title;
      }

      // Check employee_seat_assignment for platform_role_name
      const { data: seatRoleAssignments, error: seatRoleError } = await supabase
        .from('employee_seat_assignment')
        .select('platform_role_name, is_active')
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      console.log('[Auth API] Seat role assignments:', { seatRoleAssignments, seatRoleError });

      if (seatRoleAssignments && seatRoleAssignments.length > 0) {
        const roleNames = seatRoleAssignments
          .map(r => r.platform_role_name)
          .filter(Boolean);

        if (roleNames.length > 0) {
          // Get role details by display_name (platform_role_name maps to display_name)
          const { data: rolesByName, error: rolesByNameError } = await supabase
            .from('platform_roles')
            .select('role_name, display_name, privilege_level')
            .in('display_name', roleNames)
            .eq('is_active', true)
            .order('privilege_level', { ascending: true });

          console.log('[Auth API] Roles by name:', { rolesByName, rolesByNameError });

          if (rolesByName && rolesByName.length > 0) {
            const primaryRole = rolesByName[0];
            privilegeLevel = primaryRole.privilege_level;
            userRole = primaryRole.display_name || primaryRole.role_name || 'User';
            console.log('[Auth API] Role from employee_seat_assignment:', userRole, 'Privilege Level:', privilegeLevel);
          }
        }
      }
    }

    // Extract name from email if not in profile
    const email = session.user.email || '';
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
    
    // Construct full name from profile
    const firstName = profile?.first_name || '';
    const lastName = profile?.last_name || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

    // Parse JWT claims for additional context
    let claims: any = {};
    if (session.access_token) {
      try {
        const payload = JSON.parse(Buffer.from(session.access_token.split('.')[1], 'base64').toString());
        claims = {
          userPlatformId: payload.userPlatformId,
          organizationPlatformId: payload.organizationPlatformId,
          entityPlatformId: payload.entityPlatformId,
          user_role: payload.user_role,
        };
      } catch (e) {
        console.error('[Auth API] Failed to parse JWT claims:', e);
      }
    }

    // Extract avatar URL from avatar_storage field using standardized storage service
    const avatarUrl = extractStorageUrl(profile?.avatar_storage);

    console.log('[Auth API] Avatar extraction:', {
      has_avatar_storage: !!profile?.avatar_storage,
      avatar_storage: profile?.avatar_storage,
      extracted_avatarUrl: avatarUrl
    });

    // Return user info
    return NextResponse.json({
      id: session.user.id,
      name: fullName || profile?.display_name || nameFromEmail || 'User',
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: userRole,
      jobTitle: jobTitle,
      privilegeLevel: privilegeLevel,
      entity_platform_id: claims.entityPlatformId || profile?.entity_platform_id || null,
      employee_entity_id: profile?.employee_entity_id || null,
      user_platform_id: profile?.user_platform_id || claims.userPlatformId || null,
      avatarUrl: avatarUrl,
      profile: profile, // Include full profile for debugging
    });
  } catch (error) {
    console.error('[Auth API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
