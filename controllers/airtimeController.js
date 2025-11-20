import Balance from "../models/Balance.js";
import { validationResult } from "express-validator";
import { Worker } from "worker_threads";

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

    // Run API purchase in background
    new Promise((resolve, reject) => {
      const worker = new Worker("./workers/airtimeWorker.js", {
        workerData: { serviceId, phoneNumber, amount, userId: req.user.id },
      });

      worker.on("message", resolve);
      worker.on("error", reject);
    });

    return res.status(200).json({ message: "Purchase is being processed in the background" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};