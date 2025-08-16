import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';
import { apiWithRetry } from '@/lib/dbRetry';

export async function GET() {
  const fallbackSettings = {
    restaurantName: 'Kedai J.A',
    description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
    address: 'Jl. Raya Leles No.45, Garut',
    contact: '081234567890',
    hours: 'Senin - Minggu, 11.00 - 22.00',
    email: 'info@kedai-ja.com'
  };

  try {
    const settings = await apiWithRetry(async () => {
      let settings = await Settings.findOne({}).lean();
      
      if (!settings) {
        const newSettings = new Settings(fallbackSettings);
        settings = await newSettings.save();
      }
      
      return settings;
    }, {
      maxRetries: 2,
      baseDelay: 1000
    });
    
    return NextResponse.json({ 
      success: true, 
      settings 
    });
  } catch (error) {
    console.error('Error fetching settings after retries:', error);
    
    // Return fallback settings instead of error
    return NextResponse.json({ 
      success: true, 
      settings: fallbackSettings,
      fallback: true,
      warning: 'Using fallback settings due to database connectivity issues'
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const updateData = await request.json();

    const settings = await apiWithRetry(async () => {
      let settings = await Settings.findOne({});

      // Fallback agar email selalu ada
      if (!('email' in updateData) || !updateData.email) {
        updateData.email = settings?.email || 'info@kedai-ja.com';
      }
      
      if (!settings) {
        settings = new Settings(updateData);
      } else {
        Object.assign(settings, updateData);
      }
      
      return await settings.save();
    }, {
      maxRetries: 3,
      baseDelay: 1000
    });
    
    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Update settings error after retries:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Database connection timeout. Please try again.' },
          { status: 408 }
        );
      }
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Network connectivity issue. Please check your connection.' },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}