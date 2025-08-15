import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const key = new TextEncoder().encode(process.env.JWT_SECRET);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function getSession(request?: NextRequest) {
  // Jika request tidak diberikan, coba ambil dari headers
  if (!request) {
    // Untuk API routes yang tidak memiliki akses ke request object
    const { cookies } = require('next/headers');
    try {
      const session = cookies().get('token')?.value;
      if (!session) return null;
      
      return await decrypt(session);
    } catch (error) {
      console.error('Session error:', error);
      return null;
    }
  }

  // Jika request diberikan, gunakan seperti biasa
  const session = request.cookies.get('token')?.value;
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}