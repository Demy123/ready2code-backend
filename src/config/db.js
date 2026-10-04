import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      console.log('Connecting to MongoDB at:', mongoUri);
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB successfully.');
      return;
    }

    // If no URI provided, use MongoMemoryServer for instant zero-config startup
    console.log('⚡ No MONGODB_URI found. Initializing built-in high-performance MongoDB instance...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('✅ Connected to built-in MongoDB successfully at:', memoryUri);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    try {
      if (!mongoMemoryServer) {
        console.log('⚡ Falling back to built-in MongoDB memory server...');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log('✅ Connected to built-in MongoDB fallback at:', memoryUri);
      }
    } catch (fallbackError) {
      console.error('Failed to initialize fallback MongoDB:', fallbackError);
      process.exit(1);
    }
  }
};
