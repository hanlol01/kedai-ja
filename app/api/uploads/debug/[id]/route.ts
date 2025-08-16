import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

/**
 * Debug API untuk melihat informasi file di GridFS
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`Debug: Checking file with ID: ${params.id}`);
    
    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }
    
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    let objectId: mongoose.Types.ObjectId;
    try {
      objectId = new mongoose.Types.ObjectId(params.id);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid ObjectId format' }, { status: 400 });
    }

    // Check if file exists
    const files = await db.collection('uploads.files').find({ _id: objectId }).toArray();
    
    if (!files.length) {
      return NextResponse.json({ 
        error: 'File not found',
        fileId: params.id,
        exists: false
      }, { status: 404 });
    }

    const file = files[0] as any;
    
    // Check chunks
    const chunks = await db.collection('uploads.chunks').find({ files_id: objectId }).toArray();
    
    // Connection info
    const connectionState = mongoose.connection.readyState;
    const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    
    return NextResponse.json({
      fileInfo: {
        _id: file._id,
        filename: file.filename,
        length: file.length,
        chunkSize: file.chunkSize,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
        metadata: file.metadata
      },
      chunks: {
        count: chunks.length,
        expectedChunks: Math.ceil(file.length / file.chunkSize),
        totalSize: chunks.reduce((sum: number, chunk: any) => sum + chunk.data.buffer.length, 0)
      },
      database: {
        connectionState: connectionStates[connectionState] || 'unknown',
        readyState: connectionState,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      debug: {
        fileId: params.id,
        exists: true,
        isCorrupted: chunks.length !== Math.ceil(file.length / file.chunkSize)
      }
    });
    
  } catch (error) {
    console.error(`Debug error for file ${params.id}:`, error);
    return NextResponse.json({ 
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
