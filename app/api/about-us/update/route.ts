import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';
import { setCache } from '../cache';

export async function POST(request: NextRequest) {
  // Set header untuk menghindari caching di Vercel
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Timeout yang lebih pendek untuk update
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database write timeout')), 10000); // 10 detik timeout
    });

    await Promise.race([connectDB(), timeoutPromise]);
    
    const updateData = await request.json();

    // Gunakan findOneAndUpdate dengan options yang dioptimalkan
    const updatePromise = AboutUs.findOneAndUpdate(
      {},
      { $set: updateData },
      { 
        new: true, 
        upsert: true, 
        setDefaultsOnInsert: true, 
        maxTimeMS: 10000,
        lean: true // Gunakan lean untuk performa
      }
    );

    const aboutUs = await Promise.race([updatePromise, timeoutPromise]);
    
    // Update cache setelah berhasil update
    setCache(aboutUs);

    // Konversi ke format yang benar untuk frontend
    const aboutUsObj = aboutUs as any;
    const formattedResponse = {
      _id: aboutUsObj._id || '',
      title: aboutUsObj.title || '',
      subtitle: aboutUsObj.subtitle || '',
      description: aboutUsObj.description || '',
      secondDescription: aboutUsObj.secondDescription || '',
      companyDescription: aboutUsObj.companyDescription || '',
      yearsOfExperience: aboutUsObj.yearsOfExperience || 0,
      masterChefs: aboutUsObj.masterChefs || 0,
      // Pastikan seluruh struktur images sesuai dengan yang diharapkan frontend
      images: {
        image1: aboutUsObj.images?.image1 || '',
        image2: aboutUsObj.images?.image2 || '',
        image3: aboutUsObj.images?.image3 || '',
        image4: aboutUsObj.images?.image4 || '',
        lingkunganKedai: Array.isArray(aboutUsObj.images?.lingkunganKedai) ? aboutUsObj.images.lingkunganKedai : [],
        spotTempatDuduk: Array.isArray(aboutUsObj.images?.spotTempatDuduk) ? aboutUsObj.images.spotTempatDuduk : []
      }
    };

    return NextResponse.json({ 
      success: true,
      message: 'About us updated successfully',
      aboutUs: formattedResponse,
      timestamp: Date.now() // Tambahkan timestamp untuk memastikan respons unik
    }, { headers });
  } catch (error: any) {
    console.error('Update about us error:', error);
    
    if (error && (error.message === 'Database write timeout' || error.name === 'MongoNetworkTimeoutError')) {
      return NextResponse.json(
        { 
          error: 'Koneksi database lambat. Coba lagi beberapa saat.',
          timestamp: Date.now() 
        },
        { status: 503, headers }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error.message || 'Unknown error'),
        timestamp: Date.now()
      },
      { status: 500, headers }
    );
  }
}
