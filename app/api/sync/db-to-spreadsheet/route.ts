import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { writeSpreadsheetData, appendSpreadsheetRow } from '@/lib/googleSheet';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🔄 Starting sync from database to spreadsheet...');
    
    // Get all menu items from database
    const menuItems = await MenuItem.find({}).sort({ name: 1 });
    
    if (menuItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No menu items found in database',
        synced: 0
      });
    }
    
    // Convert database items to spreadsheet format
    const spreadsheetData = menuItems.map(item => ({
      name: item.name,
      price: item.price,
      available: item.available
    }));
    
    // Write all data to spreadsheet (overwrite existing data)
    await writeSpreadsheetData(spreadsheetData);
    
    console.log(`✅ Sync completed: ${spreadsheetData.length} items synced to spreadsheet`);
    
    return NextResponse.json({
      success: true,
      message: 'Sync from database to spreadsheet completed',
      synced: spreadsheetData.length,
      items: spreadsheetData.map(item => ({
        name: item.name,
        price: item.price,
        available: item.available
      }))
    });
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to sync from database to spreadsheet',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST method untuk manual trigger
export async function POST(request: NextRequest) {
  return GET(request);
} 