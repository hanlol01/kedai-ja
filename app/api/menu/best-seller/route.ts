import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

// Cache ringan untuk mempercepat homepage - diperpanjang untuk mengurangi beban DB
let cachedBestSellers: any[] | null = null;
let cacheTimeBestSellers = 0;
const BEST_SELLER_CACHE_MS = 15 * 60 * 1000; // 15 menit (diperpanjang dari 5 menit)

// Fallback data untuk menghindari timeout
const FALLBACK_BEST_SELLERS = [
  {
    _id: 'fallback-1',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    price: 25000,
    category: 'Nasi',
    image: '/menu/nasi-goreng.jpg',
    available: true
  },
  {
    _id: 'fallback-2',
    name: 'Ayam Goreng',
    description: 'Ayam goreng crispy dengan bumbu special',
    price: 30000,
    category: 'Ayam',
    image: '/menu/ayam-goreng.jpg',
    available: true
  }
];

// GET - Mengambil 6 menu best seller untuk ditampilkan di homepage
export async function GET() {
  try {
    // Serve dari cache jika masih valid - prioritas utama
    const now = Date.now();
    if (cachedBestSellers && (now - cacheTimeBestSellers < BEST_SELLER_CACHE_MS)) {
      return NextResponse.json({ 
        success: true, 
        bestSellers: cachedBestSellers, 
        fromCache: true,
        cacheAge: Math.floor((now - cacheTimeBestSellers) / 1000) // dalam detik
      });
    }

    // Timeout yang lebih pendek untuk database query
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('BestSeller query timeout')), 1500) // 1.5 detik
    );

    // Connect ke database dengan timeout
    await Promise.race([connectDB(), timeoutPromise]);

    // Query database dengan projection untuk mengurangi data transfer
    const bestSellersPromise = BestSeller.find({}, {
      menuId: 1,
      createdAt: 1
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('menuId', {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        category: 1,
        image: 1,
        available: 1
      })
      .lean();

    const bestSellers = await Promise.race([bestSellersPromise, timeoutPromise]);

    // Map data dengan validasi yang lebih ketat
    let mapped = (bestSellers as any[])
      .filter(item => item.menuId && item.menuId._id) // pastikan menu valid
      .map(item => ({
        _id: item.menuId._id,
        name: item.menuId.name || 'Menu',
        description: item.menuId.description || '',
        price: item.menuId.price || 0,
        category: item.menuId.category || 'Lainnya',
        image: item.menuId.image || '/menu/default.jpg',
        available: item.menuId.available !== false // default true
      }));

    // Fallback: jika kosong, gunakan flag isBestSeller dari MenuItem
    if (!mapped || mapped.length === 0) {
      const fallbackPromise = MenuItem.find({ 
        isBestSeller: true,
        available: { $ne: false } // hanya yang available
      }, {
        _id: 1,
        name: 1,
        description: 1,
        price: 1,
        category: 1,
        image: 1,
        available: 1
      })
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean();
        
      const fallback = await Promise.race([fallbackPromise, timeoutPromise]);
      mapped = (fallback as any[]).map(mi => ({
        _id: mi._id,
        name: mi.name || 'Menu',
        description: mi.description || '',
        price: mi.price || 0,
        category: mi.category || 'Lainnya',
        image: mi.image || '/menu/default.jpg',
        available: mi.available !== false
      }));
    }

    // Simpan cache
    cachedBestSellers = mapped;
    cacheTimeBestSellers = now;

    return NextResponse.json({ 
      success: true, 
      bestSellers: mapped,
      fromDatabase: true
    });
    
  } catch (error: any) {
    console.warn('Best seller query failed, serving fallback/cache:', error.message);
    
    // Jika cache ada, tetap layani dari cache
    if (cachedBestSellers) {
      return NextResponse.json({ 
        success: true, 
        bestSellers: cachedBestSellers, 
        fromCache: true,
        note: 'Served from cache due to database error'
      });
    }
    
    // Jika tidak ada cache, gunakan fallback data
    return NextResponse.json({ 
      success: true, 
      bestSellers: FALLBACK_BEST_SELLERS, 
      fromFallback: true,
      note: 'Served from fallback data'
    });
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
    
    const { menuId } = await request.json();

    if (!menuId) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    // Cek apakah menu exists
    const menuExists = await MenuItem.findById(menuId);
    if (!menuExists) {
      return NextResponse.json(
        { error: 'Menu not found' },
        { status: 404 }
      );
    }

    // Cek apakah sudah menjadi best seller
    const existingBestSeller = await BestSeller.findOne({ menuId });
    if (existingBestSeller) {
      return NextResponse.json(
        { error: 'Menu sudah menjadi best seller' },
        { status: 400 }
      );
    }

    // Cek jumlah best seller saat ini
    const currentCount = await BestSeller.countDocuments();
    if (currentCount >= 6) {
      return NextResponse.json(
        { error: 'Maksimal 6 menu best seller. Hapus salah satu terlebih dahulu.' },
        { status: 400 }
      );
    }

    const bestSeller = new BestSeller({ menuId });
    await bestSeller.save();
    
    // Invalidate cache setelah perubahan
    cachedBestSellers = null;
    cacheTimeBestSellers = 0;

    return NextResponse.json({ 
      message: 'Menu berhasil ditambahkan ke best seller',
      bestSeller 
    });
  } catch (error) {
    console.error('Add best seller error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}