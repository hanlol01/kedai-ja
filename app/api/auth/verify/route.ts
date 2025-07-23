import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    
    if (!session) {
      return NextResponse.json(
        { error: 'No valid session' },
        { status: 401 }
      );
    }

    // Check if session is expired
    const now = Date.now();
    if (session.expires && now > new Date(session.expires).getTime()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Session valid',
      user: {
        id: session.userId,
        email: session.email,
        name: session.name,
      },
      rememberMe: session.rememberMe || false,
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 401 }
    );
  }
}