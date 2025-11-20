import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const walletFundingSchema = new mongoose.Schema({
  user: {
    type: String, // Because you're storing email from webhook
    required: true,
  },
  fund_amount: {
    type: Number,
    required: true,
  },
  settle_amount: {
    type: Number,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
  },
  transaction_reference: {
    type: String,
    unique: true,  // Prevent duplicates
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  header: {
    type: String,
    default: "Account Fund",
  }
}, { timestamps: true });

const WalletFunding = mongoose.model("WalletFunding", walletFundingSchema);
registerModel("WalletFunding", WalletFunding);
export default WalletFunding;