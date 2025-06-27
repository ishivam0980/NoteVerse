
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/noteVerse'; 

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(' MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1); 
  }
};

export default connectDB;
