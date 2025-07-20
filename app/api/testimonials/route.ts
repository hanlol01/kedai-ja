import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonials';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      testimonials 
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch testimonials',
        testimonials: [] 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { name, email, rating, message } = await request.json();

    if (!name || !email || !rating || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const testimonial = new Testimonial({
      name,
      email,
      rating,
      message,
    });

    await testimonial.save();
    
    return NextResponse.json({ 
      message: 'Testimonial submitted successfully',
      testimonial 
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}