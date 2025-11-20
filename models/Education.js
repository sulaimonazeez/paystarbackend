import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const educationSchema = new mongoose.Schema({
  serviceID: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "WAEC"
  amount: { type: Number, required: true },
}, { timestamps: true });
const Education = mongoose.model("Education", educationSchema);
registerModel("Education", Education);
export default Education;
