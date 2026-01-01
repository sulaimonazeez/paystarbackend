import Balance from "../models/Balance.js";
import { purchaseData } from "../services/processData.js";
import PurchaseSchema from "../models/PurchaseSchema.js";
import { validationResult } from "express-validator";
import DataPlan from "../models/DataPlan.js";

export const BuyBundle = async (req, res) => {
  // 1️⃣ Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { serviceId, phoneNumber } = req.body;
    
    const plan = await DataPlan.findOne({ serviceID: serviceId });
    if (!plan) return res.status(404).json({ message: "No plan found" });

    // 3️⃣ Find user balance
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance) return res.status(404).json({ message: "Balance not found" });

    if (Number(plan.amount) > balance.balance) {
      return res.status(402).json({ message: "Insufficient Fund" });
    }

    balance.balance -= Number(plan.amount);
    await balance.save();

    // 5️⃣ Generate reference
    const reference = `${serviceId}-${Date.now()}`;
    try {
        const result = await purchaseData(serviceId, phoneNumber);
        const rawStatus = result?.data?.status?.toLowerCase() || "failed";
        if (rawStatus === "failed" || rawStatus === "error") {
          balance.balance += Number(plan.amount);
          balance.save();
          await PurchaseSchema.create({
          user: req.user.id,
          serviceType: "data",
          amount: plan.amount,
          status,
          message,
          reference: referenceUsed,
          responseData: result?.data || {},
        });
          return res.status(401).json({message:"Unable to process payment"})
        }
        let status;
        switch (rawStatus) {
          case "success":
            status = "success";
            break;
          case "pending":
            status = "pending";
            break;
          default:
            status = "failed"; // everything else → FAILED
        }

        const message = result?.data?.message || "No response from API";
        const referenceUsed = result?.data?.data?.reference || reference;

        // 9️⃣ Save purchase record safely
        await PurchaseSchema.create({
          user: req.user.id,
          serviceType: "data",
          amount: plan.amount,
          status,
          message,
          reference: referenceUsed,
          responseData: result?.data || {},
        });

        console.log(`✅ Purchase completed for ${phoneNumber}, status: ${status}`);
      } catch (err) {
        console.error("❌ Background purchase error:", err.message || err);
      }
    res.status(200).json({ status: "PROCESSING", reference });

  } catch (err) {
    console.error("❌ BuyBundle controller error:", err.message || err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
