import { createBrowserClient } from '@supabase/ssr';
import { secureError } from './secure-logging';

/**
 * Authenticated fetch helper for client-side API calls
 * 
 * Hybrid approach that handles both:
 * 1. Direct HRMS access (bearer tokens from Supabase session)
 * 2. HMS Gateway proxy access (bearer tokens from HMS auth service)
 * 
 * This ensures compatibility with HMS gateway while using bearer tokens consistently
 */
// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  let accessToken: string | null = null;
  
  // 1. Check for HRMS session cookie first (from handshake)
  const sessionToken = getCookie('hrms_session_token');
  if (sessionToken) {
    console.log('[AuthenticatedFetch] Using HRMS session token from cookie');
    accessToken = sessionToken;
  }
  
  // 2. Fallback: Check for HMS token in URL parameters (old iframe context)
  if (!accessToken) {
    const urlParams = new URLSearchParams(window.location.search);
    const hmsToken = urlParams.get('hms_token');
    
    if (hmsToken) {
      console.log('[AuthenticatedFetch] Using HMS token from URL parameter (fallback)');
      accessToken = decodeURIComponent(hmsToken);
    }
  }
  
  // Check if we're running through HMS gateway (different origin/port)
  const isHMSGateway = window.location.port === '6900';
  
  if (!accessToken && isHMSGateway) {
    // HMS Gateway: Get access token from HMS auth service
    try {
      console.log('[AuthenticatedFetch] Detected HMS Gateway access, fetching token...');
      const authResponse = await fetch('/api/auth/me', {
        credentials: 'include' // Include cookies for HMS session
      });
      
      console.log('[AuthenticatedFetch] HMS auth response status:', authResponse.status);
      
      if (authResponse.ok) {
        const authData = await authResponse.json();
        accessToken = authData.access_token;
        console.log('[AuthenticatedFetch] Got access token:', !!accessToken);
      } else {
        console.warn('[AuthenticatedFetch] HMS auth failed:', await authResponse.text());
      }
      
      if (!accessToken) {
        // Fallback: Try to get token from Supabase session if HMS auth fails
        console.log('[AuthenticatedFetch] HMS gateway returned no token, checking Supabase session');
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          accessToken = session.access_token;
          console.log('[AuthenticatedFetch] Using Supabase fallback token');
        } else {
          throw new Error('No access token available - please log in');
        }
      }
    } catch (error) {
      secureError('[AuthenticatedFetch] HMS gateway auth failed', error);
      
      // Final fallback: Try Supabase direct authentication
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session?.access_token) {
          accessToken = session.access_token;
          console.log('[AuthenticatedFetch] Using Supabase emergency fallback');
        } else {
          throw new Error('No authentication available - please log in');
        }
      } catch (fallbackError) {
        secureError('[AuthenticatedFetch] All authentication methods failed', fallbackError);
        throw new Error('Authentication failed - please refresh and try again');
      }
    }
  } else if (!accessToken) {
    // Direct HRMS access - use Supabase bearer token authentication
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the current session and access token
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      secureError('[AuthenticatedFetch] Session error', error);
      throw new Error(`Authentication error: ${error.message}`);
    }
    
    if (!session) {
      console.warn('[AuthenticatedFetch] No active session - user needs to log in');
      throw new Error('No active session. Please log in.');
    }
    
    if (!session?.access_token) {
      console.warn('[AuthenticatedFetch] Session exists but no access token - session may be expired');
      throw new Error('Invalid session: missing access token');
    }
    
    accessToken = session.access_token;
  }

  // Use bearer token authentication consistently
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: isHMSGateway ? 'include' : 'same-origin',
  });

  // Handle 401 errors with fallback to cookie-based auth
  if (response.status === 401 && isHMSGateway) {
    secureError('[AuthenticatedFetch] 401 with bearer token, trying cookie fallback', new Error('Bearer auth failed'), {
      url,
      hasAuthHeader: !!headers.Authorization,
      tokenLength: accessToken?.length || 0,
      isHMSGateway
    });
    
    // Fallback: Try cookie-based authentication for HMS gateway
    console.log('[AuthenticatedFetch] Falling back to cookie authentication');
    const fallbackResponse = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Use cookies instead of bearer token
    });
    
    return fallbackResponse;
  }
  
  // Log authentication failures for debugging (but don't treat as errors for 401)
  if (response.status === 401) {
    console.warn('[AuthenticatedFetch] Authentication required', {
      url,
      hasAuthHeader: !!headers.Authorization,
      tokenLength: accessToken?.length || 0,
      isHMSGateway,
      message: 'User needs to log in'
    });
  }

  return response;
}

/**
 * Convenience wrapper for authenticated GET requests
 */
export async function authenticatedGet(url: string) {
  return authenticatedFetch(url, { method: 'GET' });
}

/**
 * Convenience wrapper for authenticated POST requests
 */
export async function authenticatedPost(url: string, data: any) {
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience wrapper for authenticated PUT requests
 */
export async function authenticatedPut(url: string, data: any) {
  return authenticatedFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience wrapper for authenticated DELETE requests
 */
export async function authenticatedDelete(url: string) {
  return authenticatedFetch(url, { method: 'DELETE' });
}

/**
 * Convenience wrapper for authenticated requests that returns parsed JSON
 */
export async function authenticatedFetchJson<T = any>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await authenticatedFetch(url, options);
  
  if (!response.ok) {
    // Handle authentication errors gracefully
    if (response.status === 401) {
      // Try to get the error message from the response body
      try {
        const errorBody = await response.json();
        const errorMessage = errorBody.error || 'Authentication required';
        throw new Error(errorMessage);
      } catch {
        throw new Error('Authentication required');
      }
    }
    
    // Handle other HTTP errors
    const errorMessage = `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return response.json();
}