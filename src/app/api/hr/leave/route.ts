import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const HRMS_BASE_URL = process.env.NEXT_PUBLIC_HRMS_URL || 'http://localhost:6860';

/**
 * Proxy endpoint for HRMS leave requests API
 * Forwards all requests to HRMS service with authentication
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);
    
    // Add entity_id if not present
    if (!searchParams.has('entity_id')) {
      searchParams.set('entity_id', 'E00000001');
    }
    
    const query = searchParams.toString();
    const url = `${HRMS_BASE_URL}/api/leave${query ? `?${query}` : ''}`;

    // Forward cookies for authentication
    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
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
    const cookieStore = await cookies();
    const body = await request.json();
    const url = `${HRMS_BASE_URL}/api/leave`;

    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
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
    const cookieStore = await cookies();
    const body = await request.json();
    const url = `${HRMS_BASE_URL}/api/leave`;

    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
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
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = `${HRMS_BASE_URL}/api/leave${query ? `?${query}` : ''}`;

    const cookieHeader = cookieStore.getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
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
