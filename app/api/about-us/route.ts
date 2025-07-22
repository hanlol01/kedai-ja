import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    let aboutUs = await AboutUs.findOne({});
    
    if (!aboutUs) {
      aboutUs = new AboutUs({
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Kami berkomitmen untuk menyajikan hidangan berkualitas tinggi dengan bahan-bahan segar pilihan.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan. Setiap hidangan dibuat dengan penuh cinta dan keahlian oleh chef berpengalaman kami.',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Didirikan dengan visi untuk melestarikan warisan kuliner nusantara, kami berkomitmen menyajikan hidangan berkualitas tinggi menggunakan bahan-bahan segar pilihan dan resep turun-temurun yang telah diwariskan dari generasi ke generasi.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: '',
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      });
      await aboutUs.save();
    }
    
    return NextResponse.json({ 
      success: true, 
      aboutUs 
    });
  } catch (error) {
    console.error('Error fetching about us:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch about us data',
        aboutUs: {
          title: 'About Us',
          subtitle: 'Welcome to Kedai J.A',
          description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
          secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan.',
          companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
          yearsOfExperience: 7,
          masterChefs: 25,
          images: {
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            lingkunganKedai: [],
            spotTempatDuduk: []
          }
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

    let aboutUs = await AboutUs.findOne({});
    
    if (!aboutUs) {
      aboutUs = new AboutUs(updateData);
    } else {
      Object.assign(aboutUs, updateData);
    }
    
    await aboutUs.save();
    
    return NextResponse.json({ 
      message: 'About us updated successfully',
      aboutUs 
    });
  } catch (error) {
    console.error('Update about us error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}