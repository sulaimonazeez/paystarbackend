import Balance from "../models/Balance.js";
import { purchaseAirtime } from "../services/processAirtime.js";
import PurchaseSchema from "../models/PurchaseSchema.js";
import { validationResult } from "express-validator";

export const AirtimePurchase = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, phoneNumber, amount } = req.body;
    const networks = { mtn: 1, airtel: 2, glo: 3 };
    const serviceId = networks[network];
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!amount || !serviceId) {
      return res.status(404).json({ message: "No plan found" });
    }
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance || Number(amount) > balance.balance) {
      return res.status(402).json({ message: "Insufficient Fund" });
    }
    
    balance.balance -= Number(amount);
    await balance.save();
    
    const reference = `${serviceId}-${Date.now()}`;
    try {
    const result = await purchaseAirtime(serviceId, phoneNumber, amount);
    console.log(result);
    let status = result?.data?.status?.toLowerCase() || "failed";
    if (status === "failed" || status === "error") {
        balance.balance += amount;
        await balance.save();
        await PurchaseSchema.create({
      user: req.user.id,
      serviceType: "airtime",
      amount:amount,
      status,
      message: result?.data?.message || "No response message",
      reference: result?.data?.data?.reference || reference,
      responseData: result?.data || {},
    });
        return res.status(401).json({message:"Unable to Process Airtime"})
    }
    if (!["success", "failed", "pending"].includes(status)) {
      status = "failed";
    }

    await PurchaseSchema.create({
      user: req.user.id,
      serviceType: "airtime",
      amount:amount,
      status,
      message: result?.data?.message || "No response message",
      reference: result?.data?.data?.reference || reference,
      responseData: result?.data || {},
    });

    console.log(`Airtime purchase completed for ${phoneNumber}`);
  } catch (err) {
    console.error("Background airtime purchase error:", err);
  }
    res.status(202).json({ status: "PROCESSING", reference });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};