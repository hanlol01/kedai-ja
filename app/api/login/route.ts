import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';
import { encrypt } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, rememberMe = false } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set different expiry times based on remember me
    const expiryDuration = rememberMe 
      ? 7 * 24 * 60 * 60 * 1000  // 7 days
      : 30 * 60 * 1000;          // 30 minutes

    const expires = new Date(Date.now() + expiryDuration);
    const session = await encrypt({ 
      userId: admin._id,
      email: admin.email,
      name: admin.name,
      rememberMe,
      expires 
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
      rememberMe,
    });

    response.cookies.set('token', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}