import { createAccount } from "../services/payvesselAccountCreation.js";
import accountDetails from "../models/userAccountDetail.js";

export const createController = async (req, res) => {
  try {
    // 1️⃣ Check if account already exists
    const existingAccount = await accountDetails.findOne({ user: req.user.id });
    if (existingAccount) {
      return res.status(409).json({ message: "Account details already exist" });
    }

    // 2️⃣ Build user full name
    const name = `${req.user.firstName} ${req.user.lastName}`;

    // 3️⃣ Call Payvessel API
    const response = await createAccount(req.user.email, name, req.user.phoneNumber);

    // 4️⃣ Validate API response
    if (response.status !== 200 || !response.data?.banks?.length) {
      return res.status(500).json({ message: "Failed to create account: No bank data returned" });
    }

    // 5️⃣ Extract first bank account info
    const { accountNumber, bankName } = response.data.banks[0];

    // 6️⃣ Save to database
    await accountDetails.create({
      user: req.user.id,
      account: accountNumber,
      bank: bankName,
    });

    // 7️⃣ Return success response
    return res.status(201).json({ account: accountNumber, bank: bankName });

  } catch (err) {
    console.error("Account creation error:", err.message);
    return res.status(500).json({ message: "Server error occurred while creating account" });
  }
};