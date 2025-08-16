import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

/**
 * Fallback API untuk file yang gagal di-stream
 * Menggunakan buffer approach untuk file kecil-menengah
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Fallback: Fetching file with ID: ${params.id}`);
    
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      console.error('Database connection not available');
      return new Response('Database connection error', { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    let objectId: mongoose.Types.ObjectId;
    try {
      objectId = new mongoose.Types.ObjectId(params.id);
    } catch (error) {
      console.error(`Invalid ObjectId format: ${params.id}`, error);
      return new Response('Invalid ID format', { status: 400 });
    }

    // Cari file di GridFS
    const files = await db.collection('uploads.files').find({ _id: objectId }).toArray();
    
    if (!files.length) {
      console.log(`File not found: ${params.id}`);
      return new Response('File tidak ditemukan', { status: 404 });
    }

    const file = files[0] as any;
    console.log(`Fallback: File found: ${file.filename}, size: ${file.length}, type: ${file.contentType}`);
    
    // Untuk file besar (>10MB), tolak dan sarankan streaming
    if (file.length > 10 * 1024 * 1024) {
      return new Response('File too large for fallback method', { status: 413 });
    }
    
    // Buffer approach untuk file kecil-menengah
    const chunks: Buffer[] = [];
    const stream = bucket.openDownloadStream(objectId);
    
    // Use Promise with proper async/await
    const bufferData = await new Promise<Buffer>((resolve, reject) => {
      const timeout = setTimeout(() => {
        stream.destroy();
        reject(new Error('Fallback timeout'));
      }, 15000); // 15 second timeout
      
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      stream.on('end', () => {
        clearTimeout(timeout);
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      
      stream.on('error', (err) => {
        clearTimeout(timeout);
        console.error(`Fallback stream error for file ${params.id}:`, err);
        reject(err);
      });
    });
    
    console.log(`Fallback: Successfully buffered ${bufferData.length} bytes for ${params.id}`);
    
    return new Response(bufferData, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Length': bufferData.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes'
      }
    });
    
  } catch (error) {
    console.error(`Fallback error for file ${params.id}:`, error);
    return new Response('Fallback internal error', { status: 500 });
  }
}
