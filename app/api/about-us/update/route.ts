import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';

// Cache reference untuk akses dari rute berbeda
let cachedAboutUs: any = null;
let cacheTime: number = 0;

export async function POST(request: NextRequest) {
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
    try {
      // Import modul utama untuk update cache globalnya
      const mod = await import('../route');
      // @ts-ignore - variable cachedAboutUs and cacheTime exist in the imported module
      mod.cachedAboutUs = aboutUs;
      // @ts-ignore
      mod.cacheTime = Date.now();
    } catch (cacheError) {
      console.warn('Failed to invalidate about-us cache:', cacheError);
      // Update cache lokal sebagai fallback
      cachedAboutUs = aboutUs;
      cacheTime = Date.now();
    }

    return NextResponse.json({ 
      success: true,
      message: 'About us updated successfully',
      aboutUs 
    });
  } catch (error: any) {
    console.error('Update about us error:', error);
    
    if (error && (error.message === 'Database write timeout' || error.name === 'MongoNetworkTimeoutError')) {
      return NextResponse.json(
        { error: 'Koneksi database lambat. Coba lagi beberapa saat.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
