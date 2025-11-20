import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const cablePlanSchema = new mongoose.Schema({
  serviceID: { type: String, required: true },
  cablePlan: { type: String, required: true }, // "STARTIMES BASIC"
  cable: { type: String, required: true },     // "STARTIMES", "GOTV"
  amount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
}, { timestamps: true });

const CablePlan = mongoose.model("CablePlan", cablePlanSchema);
registerModel("CablePlan", CablePlan);
export default CablePlan;