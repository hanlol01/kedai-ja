import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const menuItems = await MenuItem.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      menuItems 
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch menu items',
        menuItems: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { name, description, price, category, image, available } = await request.json();

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image: image || '',
      available: available !== undefined ? available : true,
    });

    await menuItem.save();
    
    return NextResponse.json({ 
      message: 'Menu item created successfully',
      menuItem 
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}