import { NextRequest, NextResponse } from 'next/server'

const HRMS_API_BASE_URL = process.env.HRMS_API_BASE_URL || 'http://localhost:6860'

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${HRMS_API_BASE_URL}/api/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error proxying roles request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}
