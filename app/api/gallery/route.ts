import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';
import { getSession } from '@/lib/auth';

// GET - Fetch all gallery items
export async function GET() {
  try {
    await connectDB();

    const gallery = await Gallery.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}

// POST - Create new gallery item
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

    const body = await request.json();
    const { title, description, fileUrl, fileType, fileName, fileSize, mimeType } = body;

    // Validasi input
    if (!title || !fileUrl || !fileType || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['image', 'video'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be image or video' },
        { status: 400 }
      );
    }

    const newGalleryItem = new Gallery({
      title,
      description: description || '',
      fileUrl,
      fileType,
      fileName,
      fileSize: fileSize || 0,
      mimeType: mimeType || '',
      isActive: true
    });

    const savedItem = await newGalleryItem.save();

    return NextResponse.json({
      success: true,
      message: 'Gallery item created successfully',
      data: savedItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}

