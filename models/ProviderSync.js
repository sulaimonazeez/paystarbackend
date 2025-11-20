// models/ProviderSync.js
import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const providerSyncSchema = new mongoose.Schema({
  provider: { type: String, unique: true },
  lastUpdated: { type: Date, default: Date.now },
  lastHash: { type: String }, // To detect if data changed
});
consg ProviderSync = mongoose.model("ProviderSync", providerSyncSchema);
registerModel("ProviderSync", ProviderSync);
export default ProviderSync;