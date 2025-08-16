import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Fetching file with ID: ${params.id}`);
    
    // Koneksi database dengan retry dan timeout yang lebih robust
    let db: any;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database connection timeout')), 8000);
      });

      await Promise.race([connectDB(), timeoutPromise]);
      db = mongoose.connection.db;
      
      if (!db || mongoose.connection.readyState !== 1) {
        console.error('Database not ready, attempting reconnect...');
        // Reset connection cache untuk force reconnect
        if (mongoose.connection.readyState !== 0) {
          await mongoose.disconnect();
        }
        await connectDB();
        db = mongoose.connection.db;
      }
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return new Response('Database connection failed', { status: 503 });
    }
    
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
      console.error(`Invalid ObjectId format: ${params.id}`, error);
      return new Response('Invalid ID format', { status: 400 });
    }

    // Timeout untuk query file
    const queryTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('File query timeout')), 8000);
    });

    // Cari file di GridFS dengan timeout
    const filesPromise = db.collection('uploads.files').find({ _id: objectId }).toArray();
    const files = await Promise.race([filesPromise, queryTimeoutPromise]);
    
    if (!files.length) {
      console.log(`File not found: ${params.id}`);
      return new Response('File tidak ditemukan', { status: 404 });
    }

    const file = files[0] as any;
    console.log(`File found: ${file.filename}, size: ${file.length}, type: ${file.contentType}`);
    
    // Untuk video, coba buffer approach untuk file kecil (<5MB)
    // Karena streaming range requests tidak stabil
    if (file.contentType?.startsWith('video/') && file.length <= 5 * 1024 * 1024) {
      console.log(`Using buffer approach for small video: ${params.id} (${file.length} bytes)`);
      
      try {
        const chunks: Buffer[] = [];
        const stream = bucket.openDownloadStream(objectId);
        
        const bufferData = await new Promise<Buffer>((resolve, reject) => {
          const timeout = setTimeout(() => {
            stream.destroy();
            reject(new Error('Buffer timeout'));
          }, 20000); // 20 second timeout
          
          stream.on('data', (chunk) => {
            chunks.push(chunk);
          });
          
          stream.on('end', () => {
            clearTimeout(timeout);
            const buffer = Buffer.concat(chunks);
            console.log(`Successfully buffered ${buffer.length} bytes for ${params.id}`);
            resolve(buffer);
          });
          
          stream.on('error', (err) => {
            clearTimeout(timeout);
            console.error(`Buffer stream error for file ${params.id}:`, err);
            reject(err);
          });
        });
        
        // Handle range requests on buffered data
        const range = _req.headers.get('range');
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : bufferData.length - 1;
          const chunksize = (end - start) + 1;
          const chunk = bufferData.slice(start, end + 1);
          
          console.log(`Buffer range request for ${params.id}: bytes ${start}-${end}/${bufferData.length}`);
          
          return new Response(chunk, {
            status: 206,
            headers: {
              'Content-Type': file.contentType || 'video/mp4',
              'Content-Range': `bytes ${start}-${end}/${bufferData.length}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize.toString(),
              'Cache-Control': 'public, max-age=3600',
            }
          });
        }
        
        // Full file response
        return new Response(bufferData, {
          headers: {
            'Content-Type': file.contentType || 'video/mp4',
            'Content-Length': bufferData.length.toString(),
            'Cache-Control': 'public, max-age=3600',
            'Accept-Ranges': 'bytes'
          }
        });
        
      } catch (bufferError) {
        console.error(`Buffer approach failed for ${params.id}:`, bufferError);
        // Fall through to regular streaming
      }
    }
    
    // Regular full file download
    const stream = bucket.openDownloadStream(objectId);
    
    // Add comprehensive timeout and error handling
    const streamTimeout = setTimeout(() => {
      console.error(`Full stream timeout for file ${params.id}`);
      stream.destroy();
    }, 20000); // 20 second timeout for full download
    
    // Handle stream errors with cleanup
    stream.on('error', (err) => {
      clearTimeout(streamTimeout);
      console.error(`GridFS full stream error for file ${params.id}:`, err);
    });
    
    stream.on('end', () => {
      clearTimeout(streamTimeout);
      console.log(`Successfully streamed file ${params.id}`);
    });

    return new Response(stream as any, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Length': file.length?.toString() || '',
        'Cache-Control': file.contentType?.startsWith('video/') 
          ? 'public, max-age=3600' // 1 hour for videos
          : 'public, max-age=31536000, immutable', // 1 year for images
        'Accept-Ranges': 'bytes' // Support untuk partial content
      }
    });
  } catch (error) {
    console.error(`Error fetching file ${params.id} from GridFS:`, error);
    
    // Berbagai jenis error handling
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return new Response('Request timeout', { status: 408 });
      }
      if (error.message.includes('not found')) {
        return new Response('File tidak ditemukan', { status: 404 });
      }
    }
    
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
