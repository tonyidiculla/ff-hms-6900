import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * HMS to HRMS Proxy with Bearer Token Forwarding
 * 
 * This proxy ensures that HMS authentication is converted to bearer tokens
 * for HRMS APIs, maintaining the standardized authentication flow.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, 'GET', resolvedParams.path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, 'POST', resolvedParams.path);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, 'PUT', resolvedParams.path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, 'DELETE', resolvedParams.path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return handleProxy(request, 'PATCH', resolvedParams.path);
}

async function handleProxy(request: NextRequest, method: string, pathSegments: string[]) {
  try {
    // Get user's access token from HMS session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log('[HMS HR Proxy] No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Extract access token for bearer authentication
    const accessToken = session.access_token;
    if (!accessToken) {
      console.log('[HMS HR Proxy] No access token in session');
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Construct target URL for HRMS
    const hrmsBaseUrl = 'http://localhost:6860';
    const targetPath = pathSegments.join('/');
    const targetUrl = `${hrmsBaseUrl}/api/${targetPath}`;
    
    // Preserve query parameters
    const url = new URL(request.url);
    const queryString = url.search;
    const finalUrl = `${targetUrl}${queryString}`;

    console.log(`[HMS HR Proxy] Forwarding ${method} ${finalUrl} with bearer token`);

    // Prepare headers for HRMS request
    const headers: HeadersInit = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-HMS-Gateway': 'true', // Flag to identify HMS gateway requests
      'X-HMS-User-ID': session.user.id,
      'X-HMS-User-Email': session.user.email || '',
    };

    // Forward request body for POST/PUT/PATCH
    let body: BodyInit | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        body = await request.text();
      } catch (error) {
        console.error('[HMS HR Proxy] Error reading request body:', error);
      }
    }

    // Make request to HRMS
    const hrmsResponse = await fetch(finalUrl, {
      method,
      headers,
      body,
    });

    // Get response data
    const responseData = await hrmsResponse.text();
    
    // Create response with appropriate status and headers
    const response = new NextResponse(responseData, {
      status: hrmsResponse.status,
      statusText: hrmsResponse.statusText,
    });

    // Copy relevant response headers
    const headersToForward = ['content-type', 'cache-control'];
    headersToForward.forEach(headerName => {
      const value = hrmsResponse.headers.get(headerName);
      if (value) {
        response.headers.set(headerName, value);
      }
    });

    console.log(`[HMS HR Proxy] Response: ${hrmsResponse.status} for ${method} ${finalUrl}`);
    
    return response;

  } catch (error) {
    console.error('[HMS HR Proxy] Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}