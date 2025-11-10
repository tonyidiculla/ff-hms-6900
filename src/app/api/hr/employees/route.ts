import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authentication headers from the HMS request
    const cookie = request.headers.get('cookie');
    const authorization = request.headers.get('authorization');
    
    // Get query parameters from the request URL
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Add required entity_id parameter if not present
    if (!searchParams.has('entity_id')) {
      searchParams.set('entity_id', 'E019nC8m3');
    }
    
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    
    // Forward the request to HRMS with proper authentication
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    
    // Create a proper bearer token for HRMS
    // For now, we'll create a service token that HRMS can accept
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';
    
    const response = await fetch(`${hrmsUrl}/api/employees${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'X-HMS-Entity': 'E019nC8m3', // Pass entity ID
        ...(cookie && { Cookie: cookie }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HRMS API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HRMS API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('HMS HR Employees Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees from HRMS' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookie = request.headers.get('cookie');
    const authorization = request.headers.get('authorization');
    
    console.log('[HMS Proxy] Creating employee with data:', JSON.stringify(body, null, 2));
    
    // Forward the request to HRMS with proper authentication
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';
    
    const response = await fetch(`${hrmsUrl}/api/employees/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'X-HMS-Entity': 'E019nC8m3',
        ...(cookie && { Cookie: cookie }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error(`[HMS Proxy] HRMS API error: ${response.status}`, data);
      return NextResponse.json(
        { 
          error: data?.error || data?.message || `HRMS API error: ${response.status}`,
          message: data?.message,
          details: data?.details
        }, 
        { status: response.status }
      );
    }

    console.log('[HMS Proxy] Employee created successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[HMS Proxy] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create employee in HRMS',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}