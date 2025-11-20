import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";
const airtimeSchema = new mongoose.Schema({
  network: { type: String, required: true }, // e.g., "MTN"
  serviceID: { type: String, required: true },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

const Airtime = mongoose.model("Airtime", airtimeSchema);
registerModel("Airtime", Airtime);
export default Airtime;