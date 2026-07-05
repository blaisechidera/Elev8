import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: {
      status: 'healthy',
      service: 'Elev8 API',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    },
    meta: { request_id: crypto.randomUUID() },
    error: null,
  });
}
