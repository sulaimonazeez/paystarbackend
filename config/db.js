import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async (retries = 3, delay = 1000) => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const connectWithRetry = async (attempt = 0) => {
      try {
        console.log("Connecting to MongoDB...");
        return await mongoose.connect(process.env.MONGO_URI); // no deprecated options
      } catch (err) {
        if (attempt < retries) {
          console.warn(
            `MongoDB connection failed. Retry attempt ${attempt + 1} in ${delay}ms`
          );
          await new Promise((res) => setTimeout(res, delay));
          return connectWithRetry(attempt + 1);
        } else {
          console.error("MongoDB connection failed after retries:", err);
          throw err;
        }
      }
    };

    cached.promise = connectWithRetry();
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// Optional: reconnect on disconnect
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Reconnecting...");
  cached.conn = null;
  cached.promise = null;
});

export default connectDb;