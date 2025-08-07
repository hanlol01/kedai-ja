import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { readSpreadsheetData, SPREADSHEET_CONFIG } from '@/lib/googleSheet';

export async function GET() {
  try {
    console.log('🧪 Starting configuration test...');
    
    const testResults = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      tests: {
        environmentVariables: {
          GOOGLE_SPREADSHEET_ID: !!process.env.GOOGLE_SPREADSHEET_ID,
          GOOGLE_SERVICE_ACCOUNT_KEY: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
          GOOGLE_SERVICE_ACCOUNT_KEY_FILE: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE,
        },
        database: false,
        spreadsheet: false,
        spreadsheetConfig: {
          spreadsheetId: SPREADSHEET_CONFIG.spreadsheetId,
          sheetName: SPREADSHEET_CONFIG.sheetName,
          range: SPREADSHEET_CONFIG.range,
        }
      },
      errors: [] as string[]
    };

    // Test 1: Environment Variables
    console.log('📋 Checking environment variables...');
    if (!process.env.GOOGLE_SPREADSHEET_ID) {
      testResults.errors.push('GOOGLE_SPREADSHEET_ID not found');
    }
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE) {
      testResults.errors.push('No Google service account configuration found');
    }

    // Test 2: Database Connection
    console.log('🗄️ Testing database connection...');
    try {
      await connectDB();
      testResults.tests.database = true;
      console.log('✅ Database connection successful');
    } catch (error) {
      testResults.errors.push(`Database connection failed: ${error}`);
      console.error('❌ Database connection failed:', error);
    }

    // Test 3: Google Sheets API
    console.log('📊 Testing Google Sheets API...');
    try {
      const data = await readSpreadsheetData();
      testResults.tests.spreadsheet = true;
      console.log(`✅ Google Sheets API successful - Found ${data.length} rows`);
    } catch (error) {
      testResults.errors.push(`Google Sheets API failed: ${error}`);
      console.error('❌ Google Sheets API failed:', error);
    }

    // Determine overall status
    const allTestsPassed = testResults.tests.database && testResults.tests.spreadsheet;
    const hasErrors = testResults.errors.length > 0;

    return NextResponse.json({
      status: allTestsPassed ? 'success' : 'error',
      message: allTestsPassed 
        ? 'All tests passed! Configuration is working correctly.' 
        : 'Some tests failed. Check the errors below.',
      ...testResults
    });

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Test endpoint failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 