import { NextRequest, NextResponse } from 'next/server';
import { triggerManualSync } from '@/lib/cronJobs';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Manual sync triggered via API...');
    
    // Trigger manual sync
    await triggerManualSync();
    
    return NextResponse.json({
      success: true,
      message: 'Manual sync triggered successfully',
      timestamp: new Date().toISOString()
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

// GET method untuk status
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Manual sync endpoint is available',
      usage: 'POST to trigger manual sync',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Manual sync status error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get manual sync status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 