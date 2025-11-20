import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { body } from "express-validator";

import { myProfile } from "../controllers/profileController.js";
import { fetchBalance } from "../controllers/fetchBalanceController.js";
import { CablePayment } from "../controllers/cablePaymentControllers.js";
import { getUserAccount } from "../controllers/getUserAccountController.js";
import { BuyBundle } from "../controllers/buyBundleController.js";
import { getAllDataPlans } from "../controllers/planController.js";
import { getUserTransactions } from "../controllers/transactionHistoryController.js";
import { createController } from "../controllers/userAccountCreateController.js";
import { payvesselWebhook } from "../controllers/payvesselWebhook.js";
import { verifyController } from "../controllers/pinController.js";
import { AirtimePurchase } from "../controllers/airtimeController.js";
import { getCable } from "../controllers/cableController.js";
import { VerifyNameController } from "../controllers/cableVerifyControlller.js";

const authRoute = express.Router();

// Profile & Balance
authRoute.get("/profile", verifyToken, myProfile);
authRoute.get("/balance", verifyToken, fetchBalance);

// Data Plans & Transactions
authRoute.get("/dataplan", verifyToken, getAllDataPlans);
authRoute.post("/data/purchase", [body("phoneNumber")
  .isString()
  .matches(/^0[7-9][0-1]\d{8}$/)
  .withMessage("Invalid Nigerian phone number"), body("serviceId")
      .exists().withMessage("serviceID is required")
      .isInt({ min: 1 }).withMessage("serviceID must be a positive integer")], verifyToken, BuyBundle);
authRoute.get("/transaction", verifyToken, getUserTransactions);

// Account Management
authRoute.post("/account/generate", verifyToken, createController);
authRoute.get("/fetch/details", verifyToken, getUserAccount);

// PIN Verification
authRoute.get("/verify/pin", verifyToken, verifyController);

// Cable
authRoute.post("/verify/cable", [body("provider").isString(), body("cardNumber")
    .exists().withMessage("Smartcard number is required")
    .isNumeric().withMessage("Smartcard number must be numeric")
    .isLength({ min: 10, max: 12 }).withMessage("Smartcard number must be 10-12 digits"),],  verifyToken, VerifyNameController);
authRoute.get("/cable/plans", verifyToken, getCable);
authRoute.post("/cable/subscribe", verifyToken, CablePayment);

// Airtime
authRoute.post("/airtime/purchase",[body("network").isString(),body("phoneNumber")
  .isString()
  .matches(/^0[7-9][0-1]\d{8}$/)
  .withMessage("Invalid Nigerian phone number") ,body("amount")
    .exists().withMessage("Amount is required")
    .isNumeric().withMessage("Amount must be a number")
    .custom((value) => value > 0).withMessage("Amount must be greater than 0")
    .custom((value) => value <= 10000).withMessage("Amount cannot exceed 10,000")], verifyToken, AirtimePurchase);

// Webhook
authRoute.post(
  "/payvessel/webhook",
  express.json({ verify: (req, res, buf) => (req.rawBody = buf) }),
  payvesselWebhook
);

// Dangerous admin route (should be removed)

export default authRoute;