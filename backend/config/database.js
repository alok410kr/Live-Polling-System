import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/live-polling-system";

if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  Warning: MONGODB_URI not set in .env file. Using default local MongoDB."
  );
  console.warn("   For MongoDB Atlas, set MONGODB_URI in backend/.env file");
}

export const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};
