import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const { targetPath } = await request.json();

    if (!targetPath) {
      return NextResponse.json({ error: 'Target path is required' }, { status: 400 });
    }

    // Get current Supabase session using server client
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

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json({ error: 'No valid session found' }, { status: 401 });
    }

    // Verify we have the iframe secret
    const iframeSecret = process.env.HRMS_IFRAME_SECRET;
    if (!iframeSecret) {
      console.error('[HMS] HRMS_IFRAME_SECRET not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Generate nonce for replay protection
    const nonce = nanoid(32);

    // Create handshake token with embedded Supabase access token
    const handshakePayload = {
      supabase_token: session.access_token,
      user_id: session.user.id,
      target_path: targetPath,
      nonce: nonce,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120, // 2 minutes TTL
      iss: 'hms-gateway',
      aud: 'hrms-service'
    };

    const handshakeToken = jwt.sign(handshakePayload, iframeSecret, { algorithm: 'HS256' });

    console.log('[HMS] Generated handshake token for user:', session.user.id, 'target:', targetPath, 'nonce:', nonce);

    return NextResponse.json({
      handshake_token: handshakeToken,
      expires_in: 120
    });

  } catch (error) {
    console.error('[HMS] Error generating iframe token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}