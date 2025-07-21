import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import { getSession } from '@/lib/auth';

// DELETE - Menghapus menu dari best seller
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const bestSeller = await BestSeller.findOneAndDelete({ menuId: params.id });

    if (!bestSeller) {
      return NextResponse.json(
        { error: 'Best seller not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Menu berhasil dihapus dari best seller' 
    });
  } catch (error) {
    console.error('Delete best seller error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}