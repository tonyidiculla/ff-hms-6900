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
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';
    
    const response = await fetch(`${hrmsUrl}/api/positions${queryString}`, {
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
      console.error(`HRMS Positions API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HRMS Positions API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('HMS HR Positions Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions from HRMS' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const positionId = url.searchParams.get('position_id');

    if (!positionId) {
      return NextResponse.json(
        { error: 'position_id is required' },
        { status: 400 }
      );
    }

    const cookie = request.headers.get('cookie');
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';

    const response = await fetch(`${hrmsUrl}/api/positions?position_id=${positionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'X-HMS-Entity': 'E019nC8m3',
        ...(cookie && { Cookie: cookie }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HRMS Positions API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HRMS Positions API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('HMS HR Positions Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update position in HRMS' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const positionId = url.searchParams.get('position_id');

    if (!positionId) {
      return NextResponse.json(
        { error: 'position_id is required' },
        { status: 400 }
      );
    }

    const cookie = request.headers.get('cookie');
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';

    const response = await fetch(`${hrmsUrl}/api/positions?position_id=${positionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'X-HMS-Entity': 'E019nC8m3',
        ...(cookie && { Cookie: cookie }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HRMS Positions API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HRMS Positions API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('HMS HR Positions Delete Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete position in HRMS' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure entity_platform_id is set
    const requestData = {
      ...body,
      entity_platform_id: body.entity_platform_id || 'E019nC8m3',
    };
    
    // Get authentication headers from the HMS request
    const cookie = request.headers.get('cookie');
    
    // Forward the request to HRMS with proper authentication
    const hrmsUrl = process.env.HRMS_URL || 'http://localhost:6860';
    const serviceToken = process.env.HRMS_SERVICE_TOKEN || 'service_token_123';
    
    console.log('Creating position with data:', requestData);
    
    const response = await fetch(`${hrmsUrl}/api/positions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceToken}`,
        'X-HMS-Entity': 'E019nC8m3',
        ...(cookie && { Cookie: cookie }),
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error(`HRMS Positions API error: ${response.status}`, errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to create position in HRMS', details: errorData.details },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('HMS HR Positions Create Error:', error);
    return NextResponse.json(
      { error: 'Failed to create position in HRMS', details: error.message }, 
      { status: 500 }
    );
  }
}