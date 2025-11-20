
import DataPlan from "../models/DataPlan.js";
export const getAllDataPlans = async (req, res) => {
  try {
    const plans = await DataPlan.find();

    // ⚡ Force fresh response
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json({
      status: 200,
      message: "All data plans fetched successfully",
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error fetching data plans",
      error: error.message,
    });
  }
};