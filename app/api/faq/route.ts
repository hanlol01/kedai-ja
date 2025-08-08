import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FAQ from '@/models/FAQ';

// GET - Ambil semua FAQ dengan search dan filter
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { category: { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Get total count
    const total = await FAQ.countDocuments(query);
    
    // Get FAQ data
    const faqs = await FAQ.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get unique categories for filter
    const categories = await FAQ.distinct('category');

    return NextResponse.json({
      success: true,
      data: {
        faqs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        categories
      }
    });

  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data FAQ' },
      { status: 500 }
    );
  }
}

// POST - Tambah FAQ baru
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { category, question, answer } = body;

    // Validation
    if (!category || !question || !answer) {
      return NextResponse.json(
        { success: false, message: 'Kategori, pertanyaan, dan jawaban diperlukan' },
        { status: 400 }
      );
    }

    const faq = new FAQ({
      category: category.trim(),
      question: question.trim(),
      answer: answer.trim()
    });

    await faq.save();

    return NextResponse.json({
      success: true,
      message: 'FAQ berhasil ditambahkan',
      data: faq
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menambahkan FAQ' },
      { status: 500 }
    );
  }
}
