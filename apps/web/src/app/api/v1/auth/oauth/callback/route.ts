import { NextResponse } from 'next/server';

/**
 * OAuth callback route for Clerk.
 * Clerk handles the OAuth flow automatically via its SDK.
 * This route is used as a callback URL in Clerk Dashboard config.
 * After successful OAuth, Clerk redirects to afterSignInUrl.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider } = body;

    // Log the auth attempt for analytics
    console.info('[auth] OAuth callback received', {
      provider,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      data: { received: true, provider },
      meta: { request_id: crypto.randomUUID() },
      error: null,
    });
  } catch (error) {
    console.error('[auth] OAuth callback error:', error);
    return NextResponse.json(
      {
        data: null,
        meta: { request_id: crypto.randomUUID() },
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process OAuth callback',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Handle OAuth redirect with query params (provider callback)
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');

  return NextResponse.json({
    data: { provider, status: 'callback_received' },
    meta: { request_id: crypto.randomUUID() },
    error: null,
  });
}
