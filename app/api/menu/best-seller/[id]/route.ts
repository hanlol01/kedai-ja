import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BestSeller from '@/models/BestSeller';
import MenuItem from '@/models/MenuItem';
import { getSession } from '@/lib/auth';

// DELETE - Menghapus menu dari best seller
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Gunakan timeouts untuk menghindari hanging requests
    const deletePromise = BestSeller.findOneAndDelete({ menuId: params.id }).exec();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Delete operation timeout')), 5000)
    );
    
    try {
      const bestSeller = await Promise.race([deletePromise, timeoutPromise]);
      
      if (!bestSeller) {
        return NextResponse.json(
          { error: 'Best seller not found' },
          { status: 404 }
        );
      }
      
      // Invalidate cache setelah perubahan dengan cara direct access
      // Import module secara dinamis dengan timeout
      const importPromise = import('../route');
      const importTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Import timeout')), 2000)
      );
      
      try {
        // Invalidate cache dengan metode yang lebih aman
        const mod = await Promise.race([importPromise, importTimeout]);
        // Akses modul dan invalidate cache
        if (mod) {
          // @ts-ignore - variable cachedBestSellers and cacheTimeBestSellers exist in the imported module
          mod.cachedBestSellers = null;
          // @ts-ignore
          mod.cacheTimeBestSellers = 0;
        }
      } catch (cacheError) {
        console.warn('Failed to invalidate best seller cache:', cacheError);
        // Lanjut execution meski gagal invalidate cache
      }
      
      // Update juga flag di MenuItem sebagai fallback mechanism
      try {
        await MenuItem.findByIdAndUpdate(params.id, { isBestSeller: false })
          .maxTimeMS(3000) // Set max execution time 3 detik
          .exec();
      } catch (updateError) {
        console.warn('Failed to update MenuItem flag:', updateError);
        // Lanjut execution meski gagal update flag
      }

      return NextResponse.json({ 
        success: true,
        message: 'Menu berhasil dihapus dari best seller'
      });
    } catch (operationError: any) {
      if (operationError.message === 'Delete operation timeout') {
        return NextResponse.json(
          { error: 'Database operation timeout. Silakan coba lagi.' },
          { status: 408 }  // Request Timeout
        );
      }
      throw operationError; // rethrow untuk error handling di catch block utama
    }
  } catch (error: any) {
    console.error('Delete best seller error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus menu dari best seller. ' + (error.message || '') },
      { status: 500 }
    );
  }
}