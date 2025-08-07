import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { triggerManualSync } from '@/lib/cronJobs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Trigger manual sync
    await triggerManualSync();
    
    return NextResponse.json({
      success: true,
      message: 'Manual sync triggered successfully'
    });
    
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to trigger manual sync',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET method untuk status sync
export async function GET(request: NextRequest) {
  try {
    // Remove authentication requirement for GET method (status check)
    return NextResponse.json({
      success: true,
      message: 'Sync system is running',
      cronEnabled: process.env.ENABLE_CRON_SYNC === 'true',
      lastSync: new Date().toISOString(),
      endpoints: {
        test: '/api/sync/test',
        spreadsheetToDb: '/api/sync/spreadsheet-to-db',
        dbToSpreadsheet: '/api/sync/db-to-spreadsheet',
        manual: '/api/sync/manual'
      }
    });
    
  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get sync status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 