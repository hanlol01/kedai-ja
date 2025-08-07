import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';
import { appendSpreadsheetRow } from '@/lib/googleSheet';

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
    
    // Auto-sync to spreadsheet
    try {
      await appendSpreadsheetRow({
        name: menuItem.name,
        price: menuItem.price,
        available: menuItem.available
      });
      console.log(`✅ Auto-synced new menu item to spreadsheet: ${menuItem.name}`);
    } catch (syncError) {
      console.error('⚠️ Failed to auto-sync to spreadsheet:', syncError);
      // Don't fail the request if sync fails
    }
    
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