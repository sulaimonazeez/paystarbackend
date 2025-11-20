import mongoose from "mongoose";
import { registerModel } from "../admin/adminRegistry.js";

const pinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    pin: {
      type: String,
      default: "1234"
      
    }
})

const pinSchemas = mongoose.model("Pin", pinSchema);
registerModel("Pin", pinSchemas);
export default pinSchemas;