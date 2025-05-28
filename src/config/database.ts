import {logger}  from '../utils/logger';
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'myrentalacademia',
      bufferCommands: false,
      maxPoolSize: 10,
    });

    isConnected = true;
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error("MongoDB connection error:", err);
    throw err;
  }
};
