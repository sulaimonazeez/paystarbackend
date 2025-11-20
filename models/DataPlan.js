import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const dataPlanSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },   // "inlomax"
    network: { type: String, required: true },    // MTN, GLO, 9MOBILE, etc
    serviceID: { type: String, required: true },
    dataPlan: { type: String, required: true },   // "500MB"
    amount: { type: Number, required: true },
    dataType: { type: String },                   // "CORPORATE GIFTING"
    validity: { type: String },                   // "30 Days"
    endpoint: { type: String },                   // e.g., "inlomax/services"
    config: { type: Object },                     // raw API object
  },
  { timestamps: true }
);


const DataPlan = mongoose.model("DataPlanned", dataPlanSchema);
registerModel("DataPlanned", DataPlan);
export default DataPlan;