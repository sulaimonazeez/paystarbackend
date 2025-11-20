import Balance from "../models/Balance.js";

export const fetchBalance = async (req, res) => {
  try {
    let balance = await Balance.findOne({ user: req.user.id });
    if (!balance) {
      await Balance.create({
        user: req.user.id,
        balance: 0.0,
        commission: 0.0
        
      });

      balance = await Balance.findOne({ user: req.user.id });
    }
    res.set("Cache-Control", "no-store"); 
    res.json({
      balance: balance.balance,
      user: balance.user,
      commission: balance.commission
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};