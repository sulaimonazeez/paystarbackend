import pinSchemas from "../models/PinModel.js";
import { validationResult } from "express-validator";
export const verifyController = async (req, res) =>{
  try {
    const pin = await pinSchemas.findOne({ user: req.user.id });
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    if (!pin) {
      await pinSchemas.create({ user: req.user.id });
      return res.json({pin:"1234"});
    }
    return res.json({ pin: pin.pin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error Occured"})
  }
}