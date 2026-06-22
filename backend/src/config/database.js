const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-project-management';

  if (!process.env.MONGODB_URI) {
    console.warn('Warning: MONGODB_URI is not set in environment; falling back to default local MongoDB URI');
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('Double-check your MongoDB connection string (MONGODB_URI) and ensure MongoDB is running.');
    process.exit(1);
  }
};

module.exports = connectDB;
