import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

// GET - Mengambil 6 menu best seller untuk ditampilkan di homepage
export async function GET() {
  try {
    await connectDB();
    
    const bestSellers = await BestSeller.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('menuId');
    
    // Filter out any null menuId (jika menu sudah dihapus) dan hanya ambil yang available
    const validBestSellers = bestSellers
      .filter(item => item.menuId && item.menuId.available)
      .map(item => ({
        _id: item.menuId._id,
        name: item.menuId.name,
        description: item.menuId.description,
        price: item.menuId.price,
        category: item.menuId.category,
        image: item.menuId.image,
        available: item.menuId.available
      }));
    
    return NextResponse.json({ 
      success: true, 
      bestSellers: validBestSellers 
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch best sellers',
        bestSellers: [] 
      },
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