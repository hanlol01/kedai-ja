import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local\n' +
    'For WebContainer environment, use MongoDB Atlas: https://cloud.mongodb.com\n' +
    'Local MongoDB (127.0.0.1:27017) is not supported in browser environments.'
  );
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached!.conn && cached!.conn.connection.readyState === 1) {
    return cached!.conn;
  }

  // Reset connection jika status tidak connected
  if (cached!.conn && cached!.conn.connection.readyState !== 1) {
    cached!.conn = null;
    cached!.promise = null;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'mongodbVSCodePlaygroundDB',
      // Connection Pool Settings - optimized untuk Vercel
      maxPoolSize: 3, // Kurangi lebih lanjut untuk serverless
      minPoolSize: 0, // Tidak perlu minimum di serverless
      
      // Timeout Settings - lebih agresif
      serverSelectionTimeoutMS: 8000, // Naikkan untuk network yang lambat
      socketTimeoutMS: 15000, // Naikkan untuk transfer file besar
      connectTimeoutMS: 8000, // Naikkan untuk initial connection
      maxIdleTimeMS: 15000, // Kurangi idle time di serverless
      
      // Retry Settings
      retryWrites: true,
      retryReads: true,
      
      // Health Check
      heartbeatFrequencyMS: 20000, // Kurangi heartbeat frequency
      
      // Additional settings untuk stabilitas
      compressors: ['none' as const], // Disable compression untuk speed
      readPreference: 'primary' as const,
      writeConcern: {
        w: 'majority' as const,
        wtimeout: 10000
      },
      
      // Family preference untuk connection
      family: 4, // Force IPv4
    };

    console.log('🔄 Attempting MongoDB connection...');
    cached!.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached!.conn = await cached!.promise;
    console.log('✅ MongoDB connected successfully');
    
    // Add connection event listeners
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      // Reset cache on error
      cached!.conn = null;
      cached!.promise = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      cached!.conn = null;
      cached!.promise = null;
    });
    
  } catch (e) {
    cached!.promise = null;
    cached!.conn = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
