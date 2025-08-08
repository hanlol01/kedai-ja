import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';
import Testimonials from '@/models/Testimonials';
import MenuItem from '@/models/MenuItem';
import FAQ from '@/models/FAQ';
import Admin from '@/models/Admin';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all data from all collections
    const [settings, testimonials, menuItems, faqs, admins] = await Promise.all([
      Settings.find({}).lean(),
      Testimonials.find({}).lean(),
      MenuItem.find({}).lean(),
      FAQ.find({}).lean(),
      Admin.find({}).select('-password').lean()
    ]);
    
    // Fetch chat history
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    const chatHistory = await db.collection('chat_history').find({}).toArray();
    
    // Combine all data
    const allData = {
      settings: {
        data: settings,
        total: settings.length
      },
      testimonials: {
        data: testimonials,
        total: testimonials.length
      },
      menuItems: {
        data: menuItems,
        total: menuItems.length
      },
      faqs: {
        data: faqs,
        total: faqs.length
      },
      admins: {
        data: admins,
        total: admins.length
      },
      chatHistory: {
        data: chatHistory,
        total: chatHistory.length
      }
    };
    
    return NextResponse.json({
      success: true,
      data: allData,
      summary: {
        totalCollections: 6,
        totalRecords: settings.length + testimonials.length + menuItems.length + faqs.length + admins.length + chatHistory.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch all data',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
