import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDb = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected....");
  } catch (err) {
    console.error("Error occured....", err);
  }
}

export default connectDb;
