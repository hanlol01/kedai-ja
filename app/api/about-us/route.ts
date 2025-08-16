import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';

// Import cache utilities
import { getCache, setCache, CACHE_DURATION } from './cache';

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
    const cacheState = getCache();
    if (cacheState.isFresh) {
      return NextResponse.json({ 
        success: true, 
        aboutUs: cacheState.data,
        fromCache: true,
        cacheAge: Math.floor((Date.now() - cacheState.time) / 1000) // dalam detik
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
    setCache(aboutUs);
    
    return NextResponse.json({ 
      success: true, 
      aboutUs,
      fromDatabase: true
    });
    
  } catch (error: any) {
    console.warn('About Us query failed, serving fallback/cache:', error.message);
    
    // 7. Gunakan cache jika ada error tapi cache tersedia
    const cacheState = getCache();
    if (cacheState.data) {
      return NextResponse.json({ 
        success: true, 
        aboutUs: cacheState.data,
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

// PUT method sudah dipindahkan ke /api/about-us/update dengan method POST
// Untuk kompatibilitas API, kita tetap menyediakan handler dengan pesan informasi
export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Method not supported on this endpoint', 
      message: 'Please use POST /api/about-us/update instead'
    },
    { status: 405 }
  );
}