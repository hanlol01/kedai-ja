import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

// Cache ringan untuk mempercepat homepage
let cachedBestSellers: any[] | null = null;
let cacheTimeBestSellers = 0;
const BEST_SELLER_CACHE_MS = 30 * 60 * 1000; // 30 menit untuk mengurangi query ke DB

// GET - Mengambil 6 menu best seller untuk ditampilkan di homepage
export async function GET() {
  try {
    // Serve dari cache jika masih valid
    const now = Date.now();
    if (cachedBestSellers && (now - cacheTimeBestSellers < BEST_SELLER_CACHE_MS)) {
      return NextResponse.json({ success: true, bestSellers: cachedBestSellers, fromCache: true });
    }

    // Koneksi ke DB terlebih dahulu tanpa timeout
    await connectDB();
    
    try {
      // Ambil daftar best seller dengan timeout yang lebih lama (8 detik)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('BestSeller query timeout')), 8000)
      );
      
      // Ambil daftar best seller berdasarkan koleksi BestSeller dengan index yang sudah dioptimalkan
      // Menggunakan select untuk mempercepat query
      const bestSellersPromise = BestSeller.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate({
          path: 'menuId',
          select: '_id name description price category image available'
        })
        .lean()
        .exec();

      const bestSellers = await Promise.race([bestSellersPromise, timeoutPromise]) as any[];

      // Jika ada, map tanpa memaksa available=true (tetap tampil meski stok habis)
      let mapped = bestSellers
        .filter(item => item.menuId) // pastikan menu tidak null
        .map(item => ({
          _id: item.menuId._id,
          name: item.menuId.name,
          description: item.menuId.description,
          price: item.menuId.price,
          category: item.menuId.category,
          image: item.menuId.image,
          available: item.menuId.available
        }));

      // Jika hasil ada, simpan ke cache dan return
      if (mapped && mapped.length > 0) {
        // Simpan cache ringan
        cachedBestSellers = mapped;
        cacheTimeBestSellers = now;
        return NextResponse.json({ success: true, bestSellers: mapped });
      }
      
      // Fallback: jika kosong, gunakan flag isBestSeller dari MenuItem
      const fallbackPromise = MenuItem.find({ isBestSeller: true })
        .select('_id name description price category image available')
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean()
        .exec();
        
      const fallback = await Promise.race([fallbackPromise, timeoutPromise]) as any[];
      
      mapped = fallback.map(mi => ({
        _id: mi._id,
        name: mi.name,
        description: mi.description,
        price: mi.price,
        category: mi.category,
        image: mi.image,
        available: mi.available,
      }));

      // Simpan cache ringan
      cachedBestSellers = mapped;
      cacheTimeBestSellers = now;

      return NextResponse.json({ success: true, bestSellers: mapped });
    } catch (queryError: any) {
      console.warn('Best seller query issue:', queryError.message);
      // Jika cache ada, tetap layani dari cache
      if (cachedBestSellers) {
        return NextResponse.json({ success: true, bestSellers: cachedBestSellers, fromCache: true, cacheReason: 'query_error' });
      }
      
      // Jika tidak ada cache, coba langsung query tanpa populate untuk fallback
      try {
        const simpleFallback = await MenuItem.find({ isBestSeller: true })
          .select('_id name description price category image available')
          .sort({ updatedAt: -1 })
          .limit(6)
          .lean();
          
        const mapped = simpleFallback.map(mi => ({
          _id: mi._id,
          name: mi.name,
          description: mi.description,
          price: mi.price,
          category: mi.category,
          image: mi.image,
          available: mi.available,
        }));
        
        // Simpan ke cache untuk selanjutnya
        cachedBestSellers = mapped;
        cacheTimeBestSellers = now;
        
        return NextResponse.json({ success: true, bestSellers: mapped, fromFallback: true });
      } catch (fallbackError) {
        // Jika semua gagal, return array kosong
        return NextResponse.json({ success: true, bestSellers: [], fromFallback: true });
      }
    }
  } catch (error: any) {
    console.error('Error fetching best sellers:', error);
    // Jika cache ada, tetap layani dari cache sebagai last resort
    if (cachedBestSellers) {
      return NextResponse.json({ success: true, bestSellers: cachedBestSellers, fromCache: true, cacheReason: 'error' });
    }
    return NextResponse.json(
      { success: true, bestSellers: [], error: 'Failed to fetch best sellers' },
      { status: 200 } // Return 200 dengan array kosong agar UI tidak error
    );
  }
}

// POST - Menambahkan menu ke daftar best seller
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Parse request body dengan timeout dan error handling
    let menuId;
    try {
      const body = await request.json();
      menuId = body.menuId;
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    if (!menuId) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    // Gunakan Promise.all untuk menjalankan semua validasi secara paralel
    try {
      // Validasi dalam satu batch dengan timeout 5 detik
      const validationPromise = Promise.all([
        // 1. Cek apakah menu exists
        MenuItem.findById(menuId).select('_id name').lean().exec(),
        
        // 2. Cek apakah sudah menjadi best seller
        BestSeller.findOne({ menuId }).lean().exec(),
        
        // 3. Cek jumlah best seller saat ini
        BestSeller.countDocuments().exec()
      ]);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Validation timeout')), 5000)
      );
      
      const [menuExists, existingBestSeller, currentCount] = await Promise.race([
        validationPromise, 
        timeoutPromise.then(() => { throw new Error('Validation timeout'); })
      ]) as [any, any, number];
      
      // Validasi setelah hasil query didapatkan
      if (!menuExists) {
        return NextResponse.json(
          { error: 'Menu not found' },
          { status: 404 }
        );
      }

      if (existingBestSeller) {
        return NextResponse.json(
          { error: 'Menu sudah menjadi best seller' },
          { status: 400 }
        );
      }

      if (currentCount >= 6) {
        return NextResponse.json(
          { error: 'Maksimal 6 menu best seller. Hapus salah satu terlebih dahulu.' },
          { status: 400 }
        );
      }

      // Jika semua validasi lolos, simpan data
      const bestSeller = new BestSeller({ menuId });
      await bestSeller.save();
      
      // Invalidate cache setelah perubahan
      cachedBestSellers = null;
      cacheTimeBestSellers = 0;
      
      // Update juga flag di MenuItem sebagai fallback mechanism
      await MenuItem.findByIdAndUpdate(menuId, { isBestSeller: true });

      return NextResponse.json({ 
        success: true,
        message: 'Menu berhasil ditambahkan ke best seller',
        bestSeller: {
          _id: bestSeller._id,
          menuId: bestSeller.menuId,
          menuName: menuExists.name
        }
      });
      
    } catch (validationError: any) {
      console.error('Validation error:', validationError.message);
      if (validationError.message === 'Validation timeout') {
        return NextResponse.json(
          { error: 'Database validation timeout. Silakan coba lagi.' },
          { status: 408 }  // Request Timeout
        );
      }
      throw validationError; // rethrow untuk error handling di catch block utama
    }
  } catch (error: any) {
    console.error('Add best seller error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan menu ke best seller. ' + (error.message || '') },
      { status: 500 }
    );
  }
}