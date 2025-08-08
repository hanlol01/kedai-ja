import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectDB();
    
    // Menggunakan mongoose connection untuk mengakses collection chat_history
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const chatHistory = await db.collection('chat_history').find({}).toArray();
    
    return NextResponse.json({
      success: true,
      data: chatHistory,
      total: chatHistory.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch chat history',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
