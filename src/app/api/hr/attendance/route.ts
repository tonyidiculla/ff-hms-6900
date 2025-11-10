import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const HRMS_BASE_URL = process.env.NEXT_PUBLIC_HRMS_URL || 'http://localhost:6860';

/**
 * Proxy endpoint for HRMS attendance API
 * Forwards all requests to HRMS service with authentication
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const { searchParams } = new URL(request.url);
    
    // Add entity_id if not present - get from user session or use default
    if (!searchParams.has('entity_id')) {
      // For now, using a placeholder - should get from user's entity
      searchParams.set('entity_id', 'E00000001');
    }
    
    const query = searchParams.toString();
    const url = `${HRMS_BASE_URL}/api/attendance${query ? `?${query}` : ''}`;

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
    console.error('[HMS -> HRMS] Attendance GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance data', details: error.message },
      { status: 500 }
    );
  }
}
