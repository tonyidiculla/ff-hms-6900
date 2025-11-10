import { NextRequest, NextResponse } from 'next/server';

const HRMS_API_URL = process.env.NEXT_PUBLIC_HRMS_API_URL || 'http://localhost:6860/api';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.text();
    const response = await fetch(`${HRMS_API_URL}/employees/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying PUT request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${HRMS_API_URL}/employees/${params.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error proxying DELETE request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
