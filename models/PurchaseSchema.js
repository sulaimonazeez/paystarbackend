import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const PurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["data", "airtime", "cable", "electricity"], // extendable
    },
    status: {
      type: String,
      required: true,
      enum: ["success", "failed", "pending"],
    },
    message: {
      type: String,
      required: true,
    },
    reference: {
      type: String, // API reference or transaction ID
      required: true,
      unique: true,
    },
    responseData: {
      type: mongoose.Schema.Types.Mixed, // <-- store full API response as-is
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Purchase = mongoose.model("Purchase", PurchaseSchema);
registerModel("Purchase", Purchase);
export default Purchase;