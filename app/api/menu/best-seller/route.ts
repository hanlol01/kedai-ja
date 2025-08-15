import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

// Cache ringan untuk mempercepat homepage
let cachedBestSellers: any[] | null = null;
let cacheTimeBestSellers = 0;
const BEST_SELLER_CACHE_MS = 5 * 60 * 1000; // 5 menit

// GET - Mengambil 6 menu best seller untuk ditampilkan di homepage
export async function GET() {
  try {
    // Serve dari cache jika masih valid
    const now = Date.now();
    if (cachedBestSellers && (now - cacheTimeBestSellers < BEST_SELLER_CACHE_MS)) {
      return NextResponse.json({ success: true, bestSellers: cachedBestSellers, fromCache: true });
    }

    // Timeout agar cepat gagal jika DB lambat
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('BestSeller query timeout')), 2000));

    await Promise.race([connectDB(), timeoutPromise]);

    // Ambil daftar best seller berdasarkan koleksi BestSeller
    const bestSellersPromise = BestSeller.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('menuId')
      .lean();

    const bestSellers = await Promise.race([bestSellersPromise, timeoutPromise]);

    // Jika ada, map tanpa memaksa available=true (tetap tampil meski stok habis)
    let mapped = (bestSellers as any[])
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

    // Fallback: jika kosong (mis. populate gagal atau data belum terset), gunakan flag isBestSeller dari MenuItem
    if (!mapped || mapped.length === 0) {
      const fallbackPromise = MenuItem.find({ isBestSeller: true })
        .sort({ updatedAt: -1 })
        .limit(6)
        .lean();
      const fallback = await Promise.race([fallbackPromise, timeoutPromise]);
      mapped = (fallback as any[]).map(mi => ({
        _id: mi._id,
        name: mi.name,
        description: mi.description,
        price: mi.price,
        category: mi.category,
        image: mi.image,
        available: mi.available,
      }));
    }

    // Simpan cache ringan
    cachedBestSellers = mapped;
    cacheTimeBestSellers = now;

    return NextResponse.json({ success: true, bestSellers: mapped });
  } catch (error: any) {
    if (error && error.message === 'BestSeller query timeout') {
      console.warn('Best seller query timed out');
      // Jika cache ada, tetap layani dari cache
      if (cachedBestSellers) {
        return NextResponse.json({ success: true, bestSellers: cachedBestSellers, fromCache: true });
      }
      // Jika tidak ada cache, fallback kosong agar UI tidak error
      return NextResponse.json({ success: true, bestSellers: [], fromFallback: true });
    }
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch best sellers', bestSellers: [] },
      { status: 500 }
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