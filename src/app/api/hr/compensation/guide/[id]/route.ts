import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from('employee_comp_guide')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching compensation guide:', error);
      return NextResponse.json(
        { error: 'Failed to fetch compensation guide', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Compensation guide not found' },
        { status: 404 }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const { job_grade, sal_min, sal_100, sal_max, over_time } = body;

    if (!job_grade || !sal_min || !sal_100 || !sal_max || !over_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('employee_comp_guide')
      .update({
        job_grade,
        sal_min,
        sal_100,
        sal_max,
        over_time,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating compensation guide:', error);
      return NextResponse.json(
        { error: 'Failed to update compensation guide', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Compensation guide not found' },
        { status: 404 }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from('employee_comp_guide')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting compensation guide:', error);
      return NextResponse.json(
        { error: 'Failed to delete compensation guide', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
