import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing configuration...');
    
    // Test environment variables
    const envVars = {
      GOOGLE_SPREADSHEET_ID: process.env.GOOGLE_SPREADSHEET_ID,
      GOOGLE_SERVICE_ACCOUNT_KEY_FILE: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
      ENABLE_CRON_SYNC: process.env.ENABLE_CRON_SYNC,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set'
    };
    
    console.log('Environment variables:', envVars);
    
    // Test database connection
    try {
      await connectDB();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Database connection failed',
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        envVars
      }, { status: 500 });
    }
    
    // Test Google Sheets configuration
    try {
      const { readSpreadsheetData } = await import('@/lib/googleSheet');
      console.log('✅ Google Sheets import successful');
      
      // Try to read spreadsheet (this will fail if config is wrong, but that's expected)
      try {
        await readSpreadsheetData();
        console.log('✅ Google Sheets read successful');
      } catch (sheetsError) {
        console.log('⚠️ Google Sheets read failed (expected if not configured):', sheetsError);
      }
      
    } catch (sheetsImportError) {
      console.error('❌ Google Sheets import failed:', sheetsImportError);
      return NextResponse.json({
        success: false,
        message: 'Google Sheets import failed',
        error: sheetsImportError instanceof Error ? sheetsImportError.message : 'Unknown error',
        envVars
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Configuration test completed',
      envVars,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 