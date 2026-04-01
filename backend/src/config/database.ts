import mongoose from 'mongoose';
import { logger } from './logger';

export const connectDB = async (uri?: string): Promise<void> => {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/candidates';
  await mongoose.connect(mongoUri);
  logger.info('MongoDB connected');
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};