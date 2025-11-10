import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const employeeId = url.searchParams.get('employee_id');
    const entityId = url.searchParams.get('entity_id');

    let query = supabase
      .from('employee_comp')
      .select('*')
      .order('revision_date', { ascending: false });

    // Filter by employee if specified
    if (employeeId) {
      query = query.eq('employee_entity_id', employeeId);
    }

    // Filter by entity if specified (for multi-tenant support)
    if (entityId) {
      // Assuming there's an entity relationship - adjust as needed
      // query = query.eq('entity_platform_id', entityId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching compensation history:', error);
      return NextResponse.json(
        { error: 'Failed to fetch compensation history', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      revision_date,
      job_grade,
      revision_reason,
      new_sal,
      exception_reason,
      user_platform_id,
      employee_entity_id,
    } = body;

    if (!revision_date || !job_grade || !revision_reason || !new_sal || !user_platform_id || !employee_entity_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employee_comp')
      .insert({
        revision_date,
        job_grade,
        revision_reason,
        new_sal,
        exception_reason: exception_reason || null,
        user_platform_id,
        employee_entity_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating compensation history record:', error);
      return NextResponse.json(
        { error: 'Failed to create compensation history', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
