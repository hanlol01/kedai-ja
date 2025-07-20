import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = new Settings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00',
        email: 'info@kedai-ja.com'
      });
      await settings.save();
    }
    
    return NextResponse.json({ 
      success: true, 
      settings 
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings',
        settings: {
          restaurantName: 'Kedai J.A',
          description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
          address: 'Jl. Raya Leles No.45, Garut',
          contact: '081234567890',
          hours: 'Senin - Minggu, 09.00 - 21.00',
          email: 'info@kedai-ja.com'
        }
      },
      { status: 500 }
    );
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

    await connectDB();
    
    const updateData = await request.json();

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
    
    await settings.save();
    
    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}