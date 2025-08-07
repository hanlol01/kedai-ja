import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { readSpreadsheetData } from '@/lib/googleSheet';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🔄 Starting sync from spreadsheet to database...');
    
    // Read data from spreadsheet
    const spreadsheetData = await readSpreadsheetData();
    
    if (spreadsheetData.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No data found in spreadsheet',
        updated: 0,
        created: 0,
        errors: []
      });
    }
    
    let updatedCount = 0;
    let createdCount = 0;
    const errors: string[] = [];
    
    // Process each row from spreadsheet
    for (const row of spreadsheetData) {
      try {
        // Find existing menu item by name (case insensitive)
        const existingItem = await MenuItem.findOne({
          name: { $regex: new RegExp(`^${row.name}$`, 'i') }
        });
        
        if (existingItem) {
          // Update existing item
          const updatedItem = await MenuItem.findByIdAndUpdate(
            existingItem._id,
            {
              price: row.price,
              available: row.available,
              updatedAt: new Date()
            },
            { new: true }
          );
          
          if (updatedItem) {
            updatedCount++;
            console.log(`✅ Updated: ${row.name} - Price: ${row.price}, Available: ${row.available}`);
          }
        } else {
          // Create new item with default values
          const newItem = new MenuItem({
            name: row.name,
            description: `Deskripsi untuk ${row.name}`,
            price: row.price,
            category: 'Makanan', // Default category
            available: row.available,
            image: '', // Default empty image
            isBestSeller: false
          });
          
          await newItem.save();
          createdCount++;
          console.log(`🆕 Created: ${row.name} - Price: ${row.price}, Available: ${row.available}`);
        }
      } catch (error) {
        const errorMsg = `Error processing "${row.name}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }
    
    console.log(`✅ Sync completed: ${updatedCount} updated, ${createdCount} created, ${errors.length} errors`);
    
    return NextResponse.json({
      success: true,
      message: 'Sync from spreadsheet to database completed',
      updated: updatedCount,
      created: createdCount,
      errors: errors,
      totalProcessed: spreadsheetData.length
    });
    
  } catch (error) {
    console.error('❌ Sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to sync from spreadsheet to database',
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