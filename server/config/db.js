import mongoose from "mongoose";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;
