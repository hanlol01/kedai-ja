import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';
import { updateSpreadsheetRow, writeSpreadsheetData } from '@/lib/googleSheet';

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
    
    const { name, description, price, category, subCategory, image, available } = await request.json();

    const menuItem = await MenuItem.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        price,
        category,
        subCategory,
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
    
    // Auto-sync to spreadsheet for price and available changes
    try {
      await updateSpreadsheetRow(menuItem.name, {
        price: menuItem.price,
        available: menuItem.available
      });
      console.log(`✅ Auto-synced updated menu item to spreadsheet: ${menuItem.name}`);
    } catch (syncError) {
      console.error('⚠️ Failed to auto-sync update to spreadsheet:', syncError);
      // Don't fail the request if sync fails
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
    
    // Auto-sync to spreadsheet after deletion (rewrite all data)
    try {
      const allMenuItems = await MenuItem.find({}).sort({ name: 1 });
      const spreadsheetData = allMenuItems.map(item => ({
        name: item.name,
        price: item.price,
        available: item.available
      }));
      
      await writeSpreadsheetData(spreadsheetData);
      console.log(`✅ Auto-synced after deletion: ${menuItem.name} removed from spreadsheet`);
    } catch (syncError) {
      console.error('⚠️ Failed to auto-sync deletion to spreadsheet:', syncError);
      // Don't fail the request if sync fails
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