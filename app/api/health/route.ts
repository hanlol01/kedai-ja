import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB();
    
    // Test Google Sheets connection (optional)
    let sheetsStatus = 'not_configured';
    try {
      const { readSpreadsheetData } = await import('@/lib/googleSheet');
      await readSpreadsheetData();
      sheetsStatus = 'connected';
    } catch (error) {
      sheetsStatus = 'error';
    }
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        googleSheets: sheetsStatus
      },
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
