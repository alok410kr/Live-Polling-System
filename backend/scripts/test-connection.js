import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/live-polling-system";

async function testConnection() {
  console.log("🔍 Testing MongoDB connection...");
  console.log(
    `📍 Connection URI: ${MONGODB_URI.replace(/:[^:@]+@/, ":****@")}`
  ); // Hide password

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");
    console.log("✅ Connection test passed!");

    // Test basic operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collection(s) in database`);

    await mongoose.disconnect();
    console.log("✅ Disconnected successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection test failed!");
    console.error("\nError details:");
    console.error(error.message);

    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Check your MONGODB_URI in backend/.env file");
    console.log("2. Verify your MongoDB Atlas cluster is running");
    console.log("3. Check if your IP is whitelisted in Network Access");
    console.log("4. Verify your database username and password");
    console.log("5. URL-encode special characters in password");
    console.log("\n📚 See MONGODB_ATLAS_SETUP.md for detailed instructions");

    process.exit(1);
  }
}

testConnection();
