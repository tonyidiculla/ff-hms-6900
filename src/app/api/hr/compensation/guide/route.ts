import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/hr/compensation/guide - Fetching from database...');
    const { data, error } = await supabase
      .from('employee_comp_guide')
      .select('*')
      .order('job_grade', { ascending: true });

    console.log('Query result - data:', data, 'error:', error);

    if (error) {
      console.error('Error fetching compensation guides:', error);
      return NextResponse.json(
        { error: 'Failed to fetch compensation guides', details: error.message },
        { status: 500 }
      );
    }

    console.log('Returning data:', JSON.stringify(data));
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

    const { job_grade, sal_min, sal_100, sal_max, over_time } = body;

    if (!job_grade || !sal_min || !sal_100 || !sal_max || !over_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Attempting to insert compensation guide:', { job_grade, sal_min, sal_100, sal_max, over_time });

    const { data, error } = await supabase
      .from('employee_comp_guide')
      .insert({
        job_grade,
        sal_min,
        sal_100,
        sal_max,
        over_time,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating compensation guide:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to create compensation guide', details: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
