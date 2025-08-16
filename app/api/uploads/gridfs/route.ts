import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const mime = file.type || 'application/octet-stream';
    const isImage = mime.startsWith('image/');
    const isVideo = mime.startsWith('video/');
    
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Hanya gambar dan video yang diizinkan' }, { status: 400 });
    }

    // Ambil buffer dari Blob
    const buffer = Buffer.from(await file.arrayBuffer());

    // Batas ukuran berbeda untuk gambar dan video
    const isVercel = !!process.env.VERCEL;
    let maxBytes;
    
    if (isVideo) {
      // Video: 50MB di production, 100MB di development
      maxBytes = isVercel ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
    } else {
      // Image: 4MB di Vercel, 15MB di development
      maxBytes = isVercel ? 4 * 1024 * 1024 : 15 * 1024 * 1024;
    }
    
    if (buffer.length > maxBytes) {
      const humanSize = Math.round(maxBytes / (1024 * 1024));
      const fileType = isVideo ? 'video' : 'gambar';
      return NextResponse.json({ 
        error: `Ukuran ${fileType} terlalu besar (maksimal ${humanSize}MB)` 
      }, { status: 413 });
    }

    const db = mongoose.connection.db;
    
    // Type safety check untuk database connection
    if (!db) {
      console.error('Database connection not available');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    const originalFilename = (file as File).name || 'unknown';
    const fileName = `${Date.now()}_${originalFilename.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    const uploadPromise: Promise<mongoose.Types.ObjectId> = new Promise((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(fileName, {
        contentType: mime,
        metadata: {
          uploadedBy: session.user?.email || 'unknown',
          originalFilename
        }
      });

      Readable.from(buffer)
        .pipe(uploadStream)
        .on('error', reject)
        .on('finish', () => resolve(uploadStream.id as mongoose.Types.ObjectId));
    });

    const fileId = await uploadPromise;
    const url = `/api/uploads/gridfs/${fileId.toString()}`;

    return NextResponse.json({
      success: true,
      fileId: fileId.toString(),
      url,
      size: buffer.length,
      filename: fileName,
      mime
    });
  } catch (error) {
    console.error('GridFS upload error:', error);
    return NextResponse.json({ error: 'Gagal mengunggah file' }, { status: 500 });
  }
}
