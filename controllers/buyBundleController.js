import { validationResult } from "express-validator";
import DataPlan from "../models/DataPlan.js";
import Balance from "../models/Balance.js";
import { Worker } from "worker_threads";

export const BuyBundle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceId, phoneNumber } = req.body;
    const plan = await DataPlan.findOne({ serviceID: serviceId });
    if (!plan) return res.status(404).json({ message: "No plan found" });

    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance) return res.status(404).json({ message: "Balance not found" });

    if (Number(plan.amount) > balance.balance) {
      return res.status(402).json({ message: "Insufficient Fund" });
    }

    // Deduct balance immediately
    balance.balance -= Number(plan.amount);
    await balance.save();

    // Generate reference
    const reference = serviceId + "-" + Date.now();

    // Respond immediately to user
    res.status(202).json({ status: "PROCESSING", reference });

    // Run the background worker
    const worker = new Worker("./workers/buyBundleWorker.js", {
      workerData: {
        serviceId,
        phoneNumber,
        userId: req.user.id,
        planAmount: plan.amount,
      },
    });

    worker.on("message", (result) => {
      if (!result.success) console.error("Background worker error:", result.error);
      else console.log("Purchase processed in background:", result.purchaseRecord.reference);
    });

    worker.on("error", (err) => console.error("Worker thread error:", err));
    worker.on("exit", (code) => {
      if (code !== 0) console.error("Worker stopped with exit code", code);
    });

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};