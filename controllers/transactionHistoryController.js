import PurchaseSchema from "../models/PurchaseSchema.js";

export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT decoded middleware

    const transactions = await PurchaseSchema.find({ user: userId })
      .sort({ createdAt: -1 });

    // Map transactions to always include `amount`
    const mappedTransactions = transactions.map((t) => ({
      ...t.toObject(), // convert mongoose doc to plain JS object
      amount:
        t.responseData?.amount ||
        t.responseData?.transactionAmount ||
        t.responseData?.data?.amount ||
        0,
    }));
    return res.status(200).json({
      success: true,
      count: mappedTransactions.length,
      transactions: mappedTransactions,
    });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching transactions",
    });
  }
};