import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await connectDB();
    
    const settings = await Settings.find({}).lean();
    
    return NextResponse.json({
      success: true,
      data: settings,
      total: settings.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
