import mongoose from 'mongoose';
import { DB_ATLAS_URI } from '../../config.js';

const connectionString = DB_ATLAS_URI || ''

export const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');
    return true; // Return true if connection succeeded
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return false; // Return false if connection failed
  }
}
