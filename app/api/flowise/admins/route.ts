import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    await connectDB();
    
    const admins = await Admin.find({}).select('-password').lean();
    
    return NextResponse.json({
      success: true,
      data: admins,
      total: admins.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admins',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
