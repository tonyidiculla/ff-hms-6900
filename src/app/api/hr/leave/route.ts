import { NextRequest, NextResponse } from 'next/server';

const HRMS_BASE_URL = process.env.NEXT_PUBLIC_HRMS_URL || 'http://localhost:6860';

/**
 * Proxy endpoint for HRMS leave requests API
 * Forwards all requests to HRMS service
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = `${HRMS_BASE_URL}/api/leave${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[HMS -> HRMS] Leave GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leave requests', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${HRMS_BASE_URL}/api/leave`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[HMS -> HRMS] Leave POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create leave request', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const url = `${HRMS_BASE_URL}/api/leave`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[HMS -> HRMS] Leave PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update leave request', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = `${HRMS_BASE_URL}/api/leave${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('[HMS -> HRMS] Leave DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete leave request', details: error.message },
      { status: 500 }
    );
  }
}
