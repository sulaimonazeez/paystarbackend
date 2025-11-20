
import CablePlan from "../models/CablePlan.js";
export const getCable = async (req, res) => {
  try {
    const cable = await CablePlan.find();
    // ⚡ Force fresh response
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json({
      status: 200,
      message: "All data plans fetched successfully",
      count: cable.length,
      data: cable,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Error fetching data plans",
      error: error.message,
    });
  }
};