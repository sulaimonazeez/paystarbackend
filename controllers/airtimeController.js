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

    if (!amount || !serviceId) {
      return res.status(404).json({ message: "No plan found" });
    }

    // Find user balance
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance || Number(amount) > balance.balance) {
      return res.status(402).json({ message: "Insufficient Fund" });
    }

    // Deduct balance immediately
    balance.balance -= Number(amount);
    await balance.save();

    // Generate reference
    const reference = `${serviceId}-${Date.now()}`;

    // Send 202 ACCEPTED immediately
    res.status(202).json({ status: "PROCESSING", reference });

    // Run airtime purchase in background
    setImmediate(async () => {
  try {
    const result = await purchaseAirtime(serviceId, phoneNumber, amount);
    console.log(result);
    // Normalize status to match enum
    let status = result?.data?.status?.toLowerCase() || "failed";
    if (!["success", "failed", "pending"].includes(status)) {
      status = "failed"; // fallback for unknown values
    }

    await PurchaseSchema.create({
      user: req.user.id,
      serviceType: "airtime",
      status,
      message: result?.data?.message || "No response message",
      reference: result?.data?.data?.reference || reference,
      responseData: result?.data || {},
    });

    console.log(`Airtime purchase completed for ${phoneNumber}`);
  } catch (err) {
    console.error("Background airtime purchase error:", err);
  }
});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};