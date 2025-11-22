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

    // 2️⃣ Find plan
    const plan = await DataPlan.findOne({ serviceID: serviceId });
    if (!plan) return res.status(404).json({ message: "No plan found" });

    // 3️⃣ Find user balance
    const balance = await Balance.findOne({ user: req.user.id });
    if (!balance) return res.status(404).json({ message: "Balance not found" });

    if (Number(plan.amount) > balance.balance) {
      return res.status(402).json({ message: "Insufficient Fund" });
    }

    // 4️⃣ Deduct balance immediately
    balance.balance -= Number(plan.amount);
    await balance.save();

    // 5️⃣ Generate reference
    const reference = `${serviceId}-${Date.now()}`;

    // 6️⃣ Send 202 ACCEPTED immediately
    res.status(202).json({ status: "PROCESSING", reference });

    // 7️⃣ Run the actual purchase in the background
    setImmediate(async () => {
      try {
        const result = await purchaseData(serviceId, phoneNumber);
        console.log(result.data);
        // 8️⃣ Map external API status to your enum
        const rawStatus = result?.data?.status?.toLowerCase() || "failed";
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
    });
  } catch (err) {
    console.error("❌ BuyBundle controller error:", err.message || err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};