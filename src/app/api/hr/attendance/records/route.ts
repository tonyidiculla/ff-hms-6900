import { NextRequest, NextResponse } from 'next/server';

const HRMS_BASE_URL = process.env.NEXT_PUBLIC_HRMS_API_URL || 'http://localhost:6860';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward request to HRMS
    const response = await fetch(`${HRMS_BASE_URL}/api/attendance/records?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error proxying to HRMS attendance records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch attendance records', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to HRMS
    const response = await fetch(`${HRMS_BASE_URL}/api/attendance/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error proxying to HRMS attendance records:', error);
    return NextResponse.json(
      { error: 'Failed to create attendance record', details: error.message },
      { status: 500 }
    );
  }
}
