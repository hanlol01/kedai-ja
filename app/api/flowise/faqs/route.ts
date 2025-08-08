import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FAQ from '@/models/FAQ';

export async function GET() {
  try {
    await connectDB();
    
    const faqs = await FAQ.find({}).lean();
    
    return NextResponse.json({
      success: true,
      data: faqs,
      total: faqs.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch FAQs',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
