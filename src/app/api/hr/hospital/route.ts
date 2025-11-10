import { NextRequest, NextResponse } from 'next/server'

const HRMS_SERVICE_URL = process.env.NEXT_PUBLIC_HRMS_SERVICE_URL || 'http://localhost:6860'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entity_id')

    if (!entityId) {
      return NextResponse.json(
        { error: 'entity_id parameter is required' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${HRMS_SERVICE_URL}/api/hospital?entity_id=${entityId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to fetch hospital address' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying hospital request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hospital address' },
      { status: 500 }
    )
  }
}
