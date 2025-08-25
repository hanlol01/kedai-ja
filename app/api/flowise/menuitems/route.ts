import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();

    // Ambil semua data tapi exclude "image" dan "__v"
    const menuItems = await MenuItem.find({}, { image: 0, __v: 0 }).lean();

    return NextResponse.json({
      success: true,
      data: menuItems,
      total: menuItems.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch menu items',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
