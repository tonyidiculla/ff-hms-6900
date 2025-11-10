import { NextRequest, NextResponse } from 'next/server'

const HRMS_SERVICE_URL = process.env.HRMS_SERVICE_URL || 'http://localhost:6860'

/**
 * Proxy endpoint to forward search-profile requests to HRMS service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('[HMS Proxy] Forwarding search-profile request:', body);

    const response = await fetch(`${HRMS_SERVICE_URL}/api/employees/search-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    console.log('[HMS Proxy] Received response from HRMS:', { 
      status: response.status, 
      found: data.found,
      message: data.message 
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to search profile' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying search-profile request:', error)
    return NextResponse.json(
      { error: 'Failed to search profile' },
      { status: 500 }
    )
  }
}
