import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';

export async function GET() {
  try {
    await connectDB();
    
    const bestSellers = await BestSeller.find({}).lean();
    
    return NextResponse.json({
      success: true,
      data: bestSellers,
      total: bestSellers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch best sellers',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
