import axios from "axios";
import CablePlan from "../models/CablePlan.js";
import Balance from "../models/Balance.js";
import PurchaseSchema from "../models/PurchaseSchema.js";

export const CablePayment = async (req, res) => {
  try {
    const { serviceID, cardNumber, provider } = req.body;

    // 1. Validate input
    if (!serviceID || !cardNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\d{10,}$/.test(cardNumber)) {
      return res.status(400).json({ message: "Invalid IUC / Card number" });
    }

    // 2. Fetch plan and balance
    const plan = await CablePlan.findOne({ serviceID });
    const balance = await Balance.findOne({ user: req.user.id });

    if (!plan) {
      console.error("No plan Found")
      return res.status(404).json({ message: "No plan found" });
    }

    if (!balance) {
      console.error("balance not found");
      return res.status(404).json({ message: "User balance doesn't exist" });
    }

    // 3. Check funds
    if (balance.balance < plan.amount) {
      console.error("Insufficient Balance");
      return res.status(402).json({ message: "Insufficient funds" });
    }

    // 4. Deduct money
    balance.balance -= plan.amount;
    await balance.save();

    // 5. Make API request
    const response = await axios.post(
      "https://inlomax.com/api/subcable",
      {
        serviceID,
        iucNum: cardNumber
      },
      {
        headers: {
          Authorization: "Token 3bfi9t7sg5sr3nbsptygrnnwbvl676yhi0u30rdy",
          "Content-Type": "application/json"
        }
      }
    );

    const apiStatus = response.data?.status || "failed";
    const apiMessage = response.data?.message || "No response";
    const apiReference =
      response.data?.data?.reference || `${serviceID}-${Date.now()}`;

    // 6. Save purchase history
    const purchaseRecord = await PurchaseSchema.create({
      user: req.user.id,
      serviceType: "cable",
      status: apiStatus,
      message: apiMessage,
      reference: apiReference,
      responseData: response.data || {}
    });

    // 7. Final response
    if (response.status === 200 && apiStatus === "success") {
      return res.status(200).json({
        message: "Successfully purchased",
        purchase: purchaseRecord
      });
    } else {
      console.error("Unable to Process");
      return res.status(500).json({
        message: "Error processing purchase",
        purchase: purchaseRecord
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};