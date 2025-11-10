import { NextRequest, NextResponse } from 'next/server';

const HRMS_URL = process.env.HRMS_URL || 'http://localhost:6860';
const SERVICE_TOKEN = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';
const ENTITY_ID = 'E019nC8m3';

async function forwardToHRMS(request: NextRequest, method: string) {
  try {
    const cookie = request.headers.get('cookie');
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Add required entity_id parameter if not present
    if (!searchParams.has('entity_id')) {
      searchParams.set('entity_id', ENTITY_ID);
    }
    
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SERVICE_TOKEN}`,
      'X-HMS-Entity': ENTITY_ID,
      ...(cookie && { Cookie: cookie }),
    };

    const options: RequestInit = {
      method,
      headers,
    };

    // Add body for POST and PUT requests
    if (method === 'POST' || method === 'PUT') {
      const body = await request.json();
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${HRMS_URL}/api/departments${queryString}`, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HRMS API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HRMS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`HMS HR Departments Proxy Error (${method}):`, error);
    return NextResponse.json(
      { error: `Failed to ${method} department in HRMS` }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return forwardToHRMS(request, 'GET');
}

export async function POST(request: NextRequest) {
  return forwardToHRMS(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return forwardToHRMS(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return forwardToHRMS(request, 'DELETE');
}
