import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import FAQ from '@/models/FAQ';
import BestSeller from '@/models/BestSeller';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch data from required collections only
    const [menuItems, faqs, bestSellers] = await Promise.all([
      MenuItem.find({}).lean(),
      FAQ.find({}).lean(),
      BestSeller.find({}).lean()
    ]);
    
    // Combine all data
    const allData = {
      menuItems: {
        data: menuItems,
        total: menuItems.length
      },
      faqs: {
        data: faqs,
        total: faqs.length
      },
      bestSellers: {
        data: bestSellers,
        total: bestSellers.length
      }
    };
    
    return NextResponse.json({
      success: true,
      data: allData,
      summary: {
        totalCollections: 3,
        totalRecords: menuItems.length + faqs.length + bestSellers.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch all data',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
