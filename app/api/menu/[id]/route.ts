import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

export async function PUT(
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
    
    const { name, description, price, category, image, available } = await request.json();

    const menuItem = await MenuItem.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price,
        category,
        image: image || '',
        available: available !== undefined ? available : true,
      },
      { new: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Menu item updated successfully',
      menuItem 
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    const menuItem = await MenuItem.findByIdAndDelete(params.id);

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Menu item deleted successfully' 
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}