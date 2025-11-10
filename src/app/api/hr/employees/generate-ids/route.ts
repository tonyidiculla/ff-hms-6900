import { NextRequest, NextResponse } from 'next/server'

const HRMS_SERVICE_URL = process.env.NEXT_PUBLIC_HRMS_SERVICE_URL || 'http://localhost:6860'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(
      `${HRMS_SERVICE_URL}/api/employees/generate-ids`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to generate employee IDs' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error proxying generate-ids request:', error)
    return NextResponse.json(
      { error: 'Failed to generate employee IDs' },
      { status: 500 }
    )
  }
}
