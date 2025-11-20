import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const balanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0.0,
      min: 0,
    },
    commission: {
      type: Number,
      default: 0.0,
      min: 0
    }
  },
  { timestamps: true }
);

const Balance = mongoose.model("Balance", balanceSchema);
registerModel("Balance", Balance);
export default Balance;