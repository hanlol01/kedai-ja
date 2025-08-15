import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Testimonial from '@/models/Testimonials';
import { getSession } from '@/lib/auth';
import mongoose from 'mongoose';

// PUT - Toggle testimonial display on dashboard
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('PUT /api/testimonials/[id]/dashboard called with id:', params.id);
  
  try {
    // Verifikasi session admin
    const session = await getSession();
    console.log('Session check result:', !!session);
    
    if (!session) {
      console.log('Unauthorized: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil parameter dan body
    const { id } = params;
    console.log('Testimonial ID:', id);
    
    const body = await request.json();
    console.log('Request body:', body);
    const { showOnDashboard } = body;
    console.log('showOnDashboard value:', showOnDashboard);

    // Validasi ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid testimonial ID format');
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    // Connect ke database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');
    
    // Jika akan menampilkan di dashboard, cek dulu jumlah yang sudah ditampilkan
    if (showOnDashboard === true) {
      console.log('Checking existing dashboard testimonials count...');
      
      // Cek testimonial yang akan diupdate, apakah sudah ditampilkan di dashboard
      const currentTestimonial = await Testimonial.findById(id);
      if (!currentTestimonial) {
        console.log('Testimonial not found');
        return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
      }
      
      // Jika testimonial belum ditampilkan di dashboard, cek jumlah yang sudah ditampilkan
      if (!currentTestimonial.showOnDashboard) {
        const dashboardCount = await Testimonial.countDocuments({ showOnDashboard: true });
        console.log('Current dashboard testimonials count:', dashboardCount);
        
        if (dashboardCount >= 3) {
          console.log('Maximum dashboard testimonials reached (3)');
          return NextResponse.json({ 
            error: 'Maksimal 3 testimonial dapat ditampilkan di halaman utama. Nonaktifkan salah satu terlebih dahulu.' 
          }, { status: 400 });
        }
      }
    }
    
    // Update testimonial
    console.log('Updating testimonial...');
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { showOnDashboard },
      { new: true }
    ).exec();
    
    console.log('Update result:', testimonial);

    if (!testimonial) {
      console.log('Testimonial not found');
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    console.log('Testimonial updated successfully');
    return NextResponse.json({ 
      message: 'Testimonial dashboard status updated successfully',
      testimonial 
    });
  } catch (error) {
    console.error('Error updating testimonial dashboard status:', error);
    return NextResponse.json({ 
      error: 'Failed to update testimonial',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
