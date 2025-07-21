import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      contacts 
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch contacts',
        contacts: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/contact called');
    await connectDB();
    console.log('Database connected');
    
    const { name, email, subject, message } = await request.json();
    console.log('Received data:', { name, email, subject, message });

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
    });

    console.log('Creating contact:', contact);
    await contact.save();
    console.log('Contact saved successfully');
    
    return NextResponse.json({ 
      message: 'Contact message sent successfully',
      contact 
    });
  } catch (error) {
    console.error('Create contact error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}