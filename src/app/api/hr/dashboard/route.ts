import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authentication headers from the HMS request
    const cookie = request.headers.get('cookie');
    const authorization = request.headers.get('authorization');
    
    // Forward the request to HRMS
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    const response = await fetch(`${hrmsUrl}/api/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie && { Cookie: cookie }),
        ...(authorization && { Authorization: authorization }),
      },
    });

    if (!response.ok) {
      throw new Error(`HRMS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('HMS HR Dashboard Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data from HRMS' }, 
      { status: 500 }
    );
  }
}