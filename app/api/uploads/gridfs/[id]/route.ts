import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    // Type safety check untuk database connection
    if (!db) {
      console.error('Database connection not available');
      return new Response('Database connection error', { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    let objectId: mongoose.Types.ObjectId;
    try {
      objectId = new mongoose.Types.ObjectId(params.id);
    } catch (error) {
      return new Response('Invalid ID format', { status: 400 });
    }

    // Cari file di GridFS
    const files = await db.collection('uploads.files').find({ _id: objectId }).toArray();
    if (!files.length) {
      return new Response('File tidak ditemukan', { status: 404 });
    }

    const file = files[0] as any;
    
    // Stream file dari GridFS
    const stream = bucket.openDownloadStream(objectId);

    return new Response(stream as any, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Length': file.length?.toString() || '',
        'Cache-Control': 'public, max-age=31536000, immutable' // Cache 1 tahun
      }
    });
  } catch (error) {
    console.error('Error fetching file from GridFS:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verifikasi autentikasi admin
    const session = await import('@/lib/auth').then(mod => mod.getSession(req));
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    
    // Type safety check untuk database connection
    if (!db) {
      console.error('Database connection not available');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    let objectId: mongoose.Types.ObjectId;
    try {
      objectId = new mongoose.Types.ObjectId(params.id);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Cek apakah file ada
    const files = await db.collection('uploads.files').find({ _id: objectId }).toArray();
    if (!files.length) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    // Hapus file dari GridFS
    await bucket.delete(objectId);

    return NextResponse.json({ success: true, message: 'File berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting file from GridFS:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
