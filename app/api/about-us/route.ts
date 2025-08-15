import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';

// Cache data untuk mengurangi waktu loading - diperpanjang untuk data yang jarang berubah
let cachedAboutUs: any = null;
let cacheTime: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik (data about us jarang berubah)

// Fallback data yang selalu tersedia
const FALLBACK_DATA = {
  title: 'Tentang Kami',
  subtitle: 'Selamat Datang di Kedai J.A',
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
};

export async function GET() {
  try {
    // 1. Cek cache terlebih dahulu - prioritas utama
    const now = Date.now();
    if (cachedAboutUs && (now - cacheTime < CACHE_DURATION)) {
      return NextResponse.json({ 
        success: true, 
        aboutUs: cachedAboutUs,
        fromCache: true,
        cacheAge: Math.floor((now - cacheTime) / 1000) // dalam detik
      });
    }

    // 2. Set timeout yang lebih pendek untuk database query
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 3000); // 3 detik timeout
    });

    // 3. Connect ke database dengan timeout yang lebih ketat
    await Promise.race([connectDB(), timeoutPromise]);
    
    // 4. Query database dengan timeout dan projection untuk mengurangi data transfer
    const aboutUsPromise = AboutUs.findOne({}, {
      title: 1,
      subtitle: 1,
      description: 1,
      secondDescription: 1,
      companyDescription: 1,
      yearsOfExperience: 1,
      masterChefs: 1,
      images: 1
    }).lean(); // Gunakan lean() untuk performa lebih baik
    
    let aboutUs = await Promise.race([aboutUsPromise, timeoutPromise]);
    
    // 5. Jika tidak ada data, gunakan default
    if (!aboutUs) {
      aboutUs = FALLBACK_DATA;
      
      // Coba simpan default data (non-blocking)
      try {
        const savePromise = new AboutUs(FALLBACK_DATA).save();
        await Promise.race([savePromise, timeoutPromise]);
      } catch (saveError) {
        console.warn('Failed to save default about us data:', saveError);
        // Tidak throw error, gunakan fallback data
      }
    }
    
    // 6. Update cache
    cachedAboutUs = aboutUs;
    cacheTime = now;
    
    return NextResponse.json({ 
      success: true, 
      aboutUs,
      fromDatabase: true
    });
    
  } catch (error: any) {
    console.warn('About Us query failed, serving fallback/cache:', error.message);
    
    // 7. Gunakan cache jika ada error tapi cache tersedia
    if (cachedAboutUs) {
      return NextResponse.json({ 
        success: true, 
        aboutUs: cachedAboutUs,
        fromCache: true,
        note: 'Served from cache due to database error'
      });
    }
    
    // 8. Fallback data jika tidak ada cache
    return NextResponse.json(
      { 
        success: true, 
        aboutUs: FALLBACK_DATA,
        fromFallback: true,
        note: 'Served from fallback data'
      },
      { status: 200 }
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
    cachedAboutUs = aboutUs;
    cacheTime = Date.now();

    return NextResponse.json({ 
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}