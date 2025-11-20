import axios from "axios";
import CablePlan from "../models/CablePlan.js";
import { validationResult } from "express-validator";

export const VerifyNameController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { cardNumber, provider } = req.body;

    // Map provider to serviceID
    const plans = { startimes: 3, dstv: 1, gotv: 2 };

    if (!provider || !cardNumber) {
      return res.status(400).json({ message: "Provider & card number required" });
    }

    const providerKey = provider.toLowerCase();

    if (!plans[providerKey]) {
      return res.status(400).json({ message: "Invalid provider" });
    }

    // Validate provider is in DB
    const checkPlan = await CablePlan.findOne({ cable: provider.toUpperCase() });
    if (!checkPlan) {
      return res.status(404).json({ message: "No Plan found" });
    }

    // Call Inlomax API
    const response = await axios.post(
      "https://inlomax.com/api/validatecable",
      {
        serviceID: plans[providerKey],
        iucNum: cardNumber
      },
      {
        headers: {
          Authorization: "Token 3bfi9t7sg5sr3nbsptygrnnwbvl676yhi0u30rdy",
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Response:", response.data?.data?.customerName);

    return res.json({
      success: true,
      customerName: response.data?.data?.customerName || null,
      raw: response.data
    });

  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.response?.data || error.message
    });
  }
};