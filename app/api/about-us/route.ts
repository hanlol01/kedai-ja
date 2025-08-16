import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import AboutUs from '@/models/AboutUs';
import { getSession } from '@/lib/auth';

// Import cache utilities
import { getCache, setCache, CACHE_DURATION } from './cache';
import { connectToDBWithRetry, ensureAboutUsExists } from './vercel-helper';

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
  // Set header untuk menghindari caching di Vercel
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');
  try {
    // 1. Cek cache terlebih dahulu - prioritas utama
    const cacheState = getCache();
    if (cacheState.isFresh) {
      return NextResponse.json({ 
        success: true, 
        aboutUs: cacheState.data,
        fromCache: true,
        cacheAge: Math.floor((Date.now() - cacheState.time) / 1000), // dalam detik
        timestamp: Date.now() // Tambahkan timestamp untuk memastikan respons unik
      }, { headers });
    }

    // Metode koneksi baru dengan retry khusus untuk Vercel
    const isVercel = process.env.VERCEL === '1';
    let connectionSuccess = false;
    
    try {
      if (isVercel) {
        console.log("Vercel environment detected, using enhanced connection method");
        connectionSuccess = await connectToDBWithRetry(3, 1000);
      } else {
        await connectDB();
        connectionSuccess = true;
      }
    } catch (error) {
      console.error("Database connection error:", error);
      connectionSuccess = false;
    }
    
    let aboutUs = null;
    
    // Jika koneksi berhasil, ambil data
    if (connectionSuccess) {
      try {
        // Timeout yang lebih panjang di Vercel
        const queryTimeout = isVercel ? 8000 : 3000;
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Database query timeout')), queryTimeout);
        });
        
        // Jika di Vercel, pastikan data about-us sudah ada
        if (isVercel) {
          // Ini akan membuat data default jika belum ada
          aboutUs = await Promise.race([
            ensureAboutUsExists(),
            timeoutPromise
          ]);
        } else {
          // Query database dengan timeout dan projection untuk mengurangi data transfer
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
          
          aboutUs = await Promise.race([aboutUsPromise, timeoutPromise]);
          
          // Jika tidak ada data, gunakan default dan simpan
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
        }
      } catch (queryError) {
        console.error("Query error after successful connection:", queryError);
        aboutUs = null; // Akan gunakan fallback
      }
    }
    
    // 6. Update cache
    setCache(aboutUs);
    
    // Pastikan data yang dikembalikan memiliki semua properti yang diharapkan
    let formattedAboutUs;
    
    if (!aboutUs) {
      console.warn("No AboutUs data returned from database, using fallback data");
      formattedAboutUs = { ...FALLBACK_DATA };
    } else {
      console.log("Successfully retrieved AboutUs data from database:", 
        aboutUs._id ? aboutUs._id.toString() : 'No ID');
      
      const aboutUsObj = aboutUs as any;
      formattedAboutUs = {
        _id: aboutUsObj._id?.toString() || 'unknown',
        title: aboutUsObj.title || FALLBACK_DATA.title,
        subtitle: aboutUsObj.subtitle || FALLBACK_DATA.subtitle,
        description: aboutUsObj.description || FALLBACK_DATA.description,
        secondDescription: aboutUsObj.secondDescription || FALLBACK_DATA.secondDescription,
        companyDescription: aboutUsObj.companyDescription || FALLBACK_DATA.companyDescription,
        yearsOfExperience: aboutUsObj.yearsOfExperience || FALLBACK_DATA.yearsOfExperience,
        masterChefs: aboutUsObj.masterChefs || FALLBACK_DATA.masterChefs,
        // Pastikan struktur images lengkap
        images: {
          image1: aboutUsObj.images?.image1 || '',
          image2: aboutUsObj.images?.image2 || '',
          image3: aboutUsObj.images?.image3 || '',
          image4: aboutUsObj.images?.image4 || '',
          lingkunganKedai: Array.isArray(aboutUsObj.images?.lingkunganKedai) ? aboutUsObj.images.lingkunganKedai : [],
          spotTempatDuduk: Array.isArray(aboutUsObj.images?.spotTempatDuduk) ? aboutUsObj.images.spotTempatDuduk : []
        }
      };
    }
    
    // Update cache dengan data yang sudah diformat
    setCache(formattedAboutUs);
    
    return NextResponse.json({ 
      success: true, 
      aboutUs: formattedAboutUs,
      fromDatabase: true,
      timestamp: Date.now() // Tambahkan timestamp untuk memastikan respons unik
    }, { headers });
    
  } catch (error: any) {
    console.warn('About Us query failed, serving fallback/cache:', error.message);
    
    // 7. Gunakan cache jika ada error tapi cache tersedia
    const cacheState = getCache();
    if (cacheState.data) {
      // Pastikan format cache juga lengkap
      const cacheData = cacheState.data as any;
      const formattedCacheData = {
        title: cacheData.title || FALLBACK_DATA.title,
        subtitle: cacheData.subtitle || FALLBACK_DATA.subtitle,
        description: cacheData.description || FALLBACK_DATA.description,
        secondDescription: cacheData.secondDescription || FALLBACK_DATA.secondDescription,
        companyDescription: cacheData.companyDescription || FALLBACK_DATA.companyDescription,
        yearsOfExperience: cacheData.yearsOfExperience || FALLBACK_DATA.yearsOfExperience,
        masterChefs: cacheData.masterChefs || FALLBACK_DATA.masterChefs,
        images: {
          image1: cacheData.images?.image1 || '',
          image2: cacheData.images?.image2 || '',
          image3: cacheData.images?.image3 || '',
          image4: cacheData.images?.image4 || '',
          lingkunganKedai: Array.isArray(cacheData.images?.lingkunganKedai) ? cacheData.images.lingkunganKedai : [],
          spotTempatDuduk: Array.isArray(cacheData.images?.spotTempatDuduk) ? cacheData.images.spotTempatDuduk : []
        }
      };
      return NextResponse.json({ 
        success: true, 
        aboutUs: formattedCacheData,
        fromCache: true,
        note: 'Served from cache due to database error',
        timestamp: Date.now() // Tambahkan timestamp untuk memastikan respons unik
      }, { headers });
    }
    
    // 8. Fallback data jika tidak ada cache
    return NextResponse.json(
      { 
        success: true, 
        aboutUs: FALLBACK_DATA,
        fromFallback: true,
        note: 'Served from fallback data',
        timestamp: Date.now() // Tambahkan timestamp untuk memastikan respons unik
      },
      { status: 200, headers }
    );
  }
}

// PUT method sudah dipindahkan ke /api/about-us/update dengan method POST
// Untuk kompatibilitas API, kita tetap menyediakan handler dengan pesan informasi
export async function PUT(request: NextRequest) {
  // Set header untuk menghindari caching di Vercel
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  headers.set('Surrogate-Control', 'no-store');

  return NextResponse.json(
    { 
      error: 'Method not supported on this endpoint', 
      message: 'Please use POST /api/about-us/update instead',
      timestamp: Date.now()
    },
    { status: 405, headers }
  );
}