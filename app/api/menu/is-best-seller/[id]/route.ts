import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';

// GET - Cek apakah menu adalah best seller
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const isBestSeller = await BestSeller.exists({ menuId: params.id });
    
    return NextResponse.json({ 
      isBestSeller: !!isBestSeller 
    });
  } catch (error) {
    console.error('Check best seller error:', error);
    return NextResponse.json(
      { isBestSeller: false },
      { status: 500 }
    );
  }
}