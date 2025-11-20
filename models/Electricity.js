import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const electricitySchema = new mongoose.Schema({
  disco: { type: String, required: true },
  serviceID: { type: String, required: true },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

const Electricity = mongoose.model("Electricity", electricitySchema);
registerModel("Electricity", Electricity);
export default Electricity;