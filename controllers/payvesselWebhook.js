import crypto from "crypto";
import express from "express";
import bodyParser from "body-parser";
import WalletFunding from "../models/WalletFunding.js";
import Balance from "../models/Balance.js";
import User from "../models/UserDb.js";



// Allowed IP addresses from Payvessel
const ALLOWED_IPS = ["3.255.23.38", "162.246.254.36"];

// Your Payvessel secret
const SECRET = "PVSECRET-";

export const payvesselWebhook =  async (req, res) => {
  try {
    const payload = req.body;
    const payvessel_signature = req.header("HTTP_PAYVESSEL_HTTP_SIGNATURE");
    const clientIp = req.connection.remoteAddress || req.ip;
    
    const generatedHash = crypto.createHmac("sha512", SECRET).update(JSON.stringify(payload)).digest("hex");
    
    //if (generatedHash !== payvessel_signature) {
      //return res.status(400).json({ message: "Invalid signature" });
      
    //}

    //if (!ALLOWED_IPS.includes(clientIp)){
      //return res.status(400).json({ message: "Unauthorized IP" });
    //}

    const data = payload;
    if (!data?.order?.amount ||
      !data?.order?.settlement_amount ||
      !data?.transaction?.reference ||
      !data?.customer?.email
    ) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    
    const amount = Number(data.order.amount);
    let settleAmount = Number(data.order.settlement_amount);
    let fee = Number(data.order.fee);
    const reference = data.transaction.reference;
    const description = data.order.description || "";
    const email = data.customer.email;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    const existing = await WalletFunding.findOne({
      transaction_reference: reference,
    });
    
    if (existing) {
      return res.status(200).json({ message: "Transaction already exists" });
    }

    if (amount > 3000) {
      fee += 50;
      settleAmount -= 50;
    } else {
      fee += 25;
      settleAmount -= 25;
    }
    
    const updatedBalance = await Balance.findOneAndUpdate(
      { user: user._id },
      { $inc: { balance: settleAmount } },
      { upsert: true, new: true }
    );
    
    
    await WalletFunding.create({
      user: user._id,
      fund_amount: amount,
      settle_amount: settleAmount,
      fees: fee,
      transaction_reference: reference,
      description,
      status: true,
      header: "Account Fund",
    });

    return res.status(200).json({
      message: "success",
      balance: updatedBalance.balance,
    });
  } catch (error) {
    console.error("Payvessel Webhook Error:", error);
    
    if (error.code === 11000) {
      return res.status(200).json({ message: "Transaction already exists" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
