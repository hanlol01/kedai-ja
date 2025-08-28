import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import Gallery from '@/models/Gallery';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    // Get all gallery items
    const galleryItems = await Gallery.find({}).lean();
    
    // Check each file
    const results = {
      total: galleryItems.length,
      valid: 0,
      broken: 0,
      brokenFiles: [] as any[]
    };

    for (const item of galleryItems) {
      try {
        // Extract file ID from URL
        const urlParts = item.fileUrl.split('/');
        const fileId = urlParts[urlParts.length - 1];
        
        if (!fileId || fileId.length !== 24) {
          results.broken++;
          results.brokenFiles.push({
            id: item._id,
            title: item.title,
            fileUrl: item.fileUrl,
            error: 'Invalid file ID format'
          });
          continue;
        }

        // Check if file exists in GridFS
        const objectId = new mongoose.Types.ObjectId(fileId);
        const files = await db.collection('uploads.files').find({ _id: objectId }).limit(1).toArray();
        
        if (files.length === 0) {
          results.broken++;
          results.brokenFiles.push({
            id: item._id,
            title: item.title,
            fileUrl: item.fileUrl,
            fileId: fileId,
            error: 'File not found in GridFS'
          });
        } else {
          results.valid++;
        }
      } catch (error) {
        results.broken++;
        results.brokenFiles.push({
          id: item._id,
          title: item.title,
          fileUrl: item.fileUrl,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Error checking files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get all gallery items
    const galleryItems = await Gallery.find({}).lean();
    const db = mongoose.connection.db;
    
    if (!db) {
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }

    const brokenItems = [];

    for (const item of galleryItems) {
      try {
        // Extract file ID from URL
        const urlParts = item.fileUrl.split('/');
        const fileId = urlParts[urlParts.length - 1];
        
        if (!fileId || fileId.length !== 24) {
          brokenItems.push(item._id);
          continue;
        }

        // Check if file exists in GridFS
        const objectId = new mongoose.Types.ObjectId(fileId);
        const files = await db.collection('uploads.files').find({ _id: objectId }).limit(1).toArray();
        
        if (files.length === 0) {
          brokenItems.push(item._id);
        }
      } catch (error) {
        brokenItems.push(item._id);
      }
    }

    // Delete broken gallery items
    const deleteResult = await Gallery.deleteMany({
      _id: { $in: brokenItems }
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${deleteResult.deletedCount} broken gallery items`,
      deletedCount: deleteResult.deletedCount,
      deletedIds: brokenItems
    });
  } catch (error) {
    console.error('Error cleaning up files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

