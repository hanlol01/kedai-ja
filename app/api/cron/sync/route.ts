import { NextRequest, NextResponse } from 'next/server';
import { triggerManualSync } from '@/lib/cronJobs';

export async function GET(request: NextRequest) {
  try {
    console.log('🕐 [VERCEL CRON] Starting scheduled sync...');
    
    await triggerManualSync();
    
    return NextResponse.json({ 
      success: true,
      message: 'Vercel cron sync completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('🕐 [VERCEL CRON] Sync error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Vercel cron sync failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
