import { NextRequest, NextResponse } from 'next/server';
import { realTimeSync } from '@/lib/realTimeSync';

export async function GET(request: NextRequest) {
  try {
    const status = realTimeSync.getStatus();
    
    return NextResponse.json({
      success: true,
      message: 'Real-time sync status',
      status,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Real-time sync status error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get real-time sync status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, interval } = await request.json();
    
    switch (action) {
      case 'start':
        const intervalSeconds = interval || 10;
        realTimeSync.start(intervalSeconds);
        return NextResponse.json({
          success: true,
          message: `Real-time sync started (every ${intervalSeconds} seconds)`,
          timestamp: new Date().toISOString()
        });
        
      case 'stop':
        realTimeSync.stop();
        return NextResponse.json({
          success: true,
          message: 'Real-time sync stopped',
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action. Use "start" or "stop"',
            availableActions: ['start', 'stop']
          },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Real-time sync control error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to control real-time sync',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 