import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Get subscribed modules for the authenticated user's entity
 */
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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user's platform ID first
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_platform_id')
      .eq('user_id', session.user.id)
      .single();

    if (profileError || !profile?.user_platform_id) {
      console.error('[HMS Subscriptions API] Profile error:', profileError);
      return NextResponse.json({ error: 'User platform ID not found' }, { status: 400 });
    }

    // Convert user_platform_id to string for comparison
    const userPlatformId = String(profile.user_platform_id);
    console.log('[HMS Subscriptions API] User platform ID:', userPlatformId);

    // Get entity assignment from employee_seat_assignment
    // employee_entity_id = hospital's internal employee ID (e.g., "fdt-001")
    // entity_platform_id = the entity's platform ID (e.g., "E019nC8m3")
    // IMPORTANT: Include user_id in query for RLS policy to work
    console.log('[HMS Subscriptions API] Querying employee_seat_assignment with:', {
      user_id: session.user.id,
      user_platform_id: userPlatformId,
      is_active: true
    });

    const { data: employeeAssignment, error: assignmentError } = await supabase
      .from('employee_seat_assignment')
      .select('employee_entity_id, entity_platform_id')
      .eq('user_id', session.user.id)
      .eq('user_platform_id', userPlatformId)
      .eq('is_active', true)
      .single();

    if (assignmentError) {
      console.error('[HMS Subscriptions API] Assignment error:', assignmentError);
      console.error('[HMS Subscriptions API] Assignment error details:', JSON.stringify(assignmentError, null, 2));
    }
    
    console.log('[HMS Subscriptions API] Assignment query result:', employeeAssignment);

    const entityPlatformId = employeeAssignment?.entity_platform_id;

    console.log('[HMS Subscriptions API] Entity assignment:', { 
      user_platform_id: profile.user_platform_id,
      employee_entity_id: employeeAssignment?.employee_entity_id,
      entity_platform_id: entityPlatformId
    });

    if (!entityPlatformId) {
      console.error('[HMS Subscriptions API] No active entity assignment found for user');
      return NextResponse.json({ 
        error: 'No active entity assignment found',
        debug: { user_platform_id: profile.user_platform_id }
      }, { status: 400 });
    }

    console.log('[HMS Subscriptions API] Fetching modules for entity:', entityPlatformId);

    // Get hospital record to verify it exists and is active
    const { data: hospital, error: hospitalError } = await supabase
      .from('hospital_master')
      .select('entity_platform_id, entity_name, subscription_status')
      .eq('entity_platform_id', entityPlatformId)
      .eq('is_active', true)
      .single();

    if (hospitalError || !hospital) {
      console.error('[HMS Subscriptions API] Hospital not found:', hospitalError);
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    if (hospital.subscription_status !== 'active') {
      console.log('[HMS Subscriptions API] Hospital subscription inactive:', hospital.subscription_status);
      return NextResponse.json({ 
        entity_id: entityPlatformId,
        entity_name: hospital.entity_name,
        modules: [],
        count: 0,
        message: 'No active subscription'
      });
    }

    // Get active subscriptions from hospital_subscriptions table
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('hospital_subscriptions')
      .select(`
        module_id,
        status,
        modules_master (
          id,
          code,
          module_name,
          module_display_name,
          module_description,
          solution_type,
          is_active
        )
      `)
      .eq('entity_platform_id', entityPlatformId)
      .eq('status', 'active');

    if (subscriptionsError) {
      console.error('[HMS Subscriptions API] Error fetching subscriptions:', subscriptionsError);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    console.log('[HMS Subscriptions API] Found subscriptions:', subscriptions?.length || 0);

    // Filter for active modules only
    const modules = (subscriptions || [])
      .filter((sub: any) => sub.modules_master?.is_active)
      .map((sub: any) => ({
        id: sub.modules_master.id,
        name: sub.modules_master.module_display_name || sub.modules_master.module_name,
        code: sub.modules_master.code,
        solution_type: sub.modules_master.solution_type,
        description: sub.modules_master.module_description || sub.modules_master.module_name,
      }));

    console.log('[HMS Subscriptions API] Active module codes:', modules.map(m => m.code));

    return NextResponse.json({
      entity_id: entityPlatformId,
      entity_name: hospital.entity_name,
      modules,
      count: modules.length
    });

  } catch (error) {
    console.error('[HMS Subscriptions API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
