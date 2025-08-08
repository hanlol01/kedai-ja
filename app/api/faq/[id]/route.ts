import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FAQ from '@/models/FAQ';

// GET - Ambil FAQ berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const faq = await FAQ.findById(params.id);
    
    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: faq
    });

  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data FAQ' },
      { status: 500 }
    );
  }
}

// PUT - Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const faq = await FAQ.findByIdAndUpdate(
      params.id,
      {
        category: category.trim(),
        question: question.trim(),
        answer: answer.trim()
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ berhasil diperbarui',
      data: faq
    });

  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memperbarui FAQ' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const faq = await FAQ.findByIdAndDelete(params.id);

    if (!faq) {
      return NextResponse.json(
        { success: false, message: 'FAQ tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'FAQ berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghapus FAQ' },
      { status: 500 }
    );
  }
}
