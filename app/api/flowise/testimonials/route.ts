import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonials from '@/models/Testimonials';

export async function GET() {
  try {
    await connectDB();
    
    const testimonials = await Testimonials.find({}).lean();
    
    return NextResponse.json({
      success: true,
      data: testimonials,
      total: testimonials.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch testimonials',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
