import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await connectDB();
    
    const menuItems = await MenuItem.find({}).lean();
    
    return NextResponse.json({
      success: true,
      data: menuItems,
      total: menuItems.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch menu items',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
