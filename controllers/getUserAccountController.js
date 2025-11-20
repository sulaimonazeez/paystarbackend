import accountDetails from "../models/userAccountDetail.js";

export const getUserAccount = async (req, res) => {
  try {
    console.log("User ID:", req.user?.id);

    const details = await accountDetails.findOne({ user: req.user.id });
    console.log("Found details:", details);

    if (!details) {
      console.log("Account not found");
      return res.status(404).json({ message: "Account details not found" });
    }

    return res.status(200).json({ details });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};