import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import Gallery from '@/models/Gallery';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File harus berupa gambar' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'Gambar terlalu besar (maksimal 10MB)' 
      }, { status: 413 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const fileName = `image_${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log(`Image saved: ${fileName} (${file.size} bytes)`);

    // Save to database
    await connectDB();
    const galleryItem = new Gallery({
      title,
      description: description || '',
      fileUrl: `/uploads/images/${fileName}`,
      fileType: 'image',
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      isActive: true,
    });

    await galleryItem.save();

    return NextResponse.json({
      success: true,
      message: 'Gambar berhasil diupload',
      data: {
        id: galleryItem._id,
        title: galleryItem.title,
        fileUrl: galleryItem.fileUrl,
        fileSize: galleryItem.fileSize,
        mimeType: galleryItem.mimeType,
      }
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({
      error: 'Gagal mengupload gambar',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
