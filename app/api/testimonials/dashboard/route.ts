import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonials';

// Cache untuk testimonial dashboard
let cachedTestimonials: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

// GET - Ambil testimonial untuk dashboard (maksimal 3)
export async function GET() {
  try {
    // Check cache first
    const now = Date.now();
    if (cachedTestimonials && (now - cacheTime) < CACHE_DURATION) {
      return NextResponse.json(cachedTestimonials);
    }

    await connectDB();
    
    const testimonials = await Testimonial.find({ showOnDashboard: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name rating message createdAt');
    
    // Update cache
    cachedTestimonials = { testimonials };
    cacheTime = now;

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching dashboard testimonials:', error);
    
    // Return cached data if available
    if (cachedTestimonials) {
      return NextResponse.json(cachedTestimonials);
    }
    
    // Return empty object with expected shape as fallback
    return NextResponse.json({ testimonials: [] });
  }
}