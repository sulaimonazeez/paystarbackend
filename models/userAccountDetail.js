import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const accountDetailsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,   // A user can only have one virtual account
      required: true
    },

    account: {
      type: String,
      required: true,
      unique: true,   // account numbers must be unique
    },

    bank: {
      type: String,
      required: true  // DO NOT make this unique (many users can use same bank)
    }
  },
  {
    timestamps: true,
  }
);

const aaccountDetails = mongoose.model("AccountDetails", accountDetailsSchema);
registerModel("AccountDetails", aaccountDetails);
export default aaccountDetails;