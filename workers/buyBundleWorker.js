import { parentPort, workerData } from "worker_threads";
import mongoose from "mongoose";
import { purchaseData } from "../services/processData.js";
import PurchaseSchema from "../models/PurchaseSchema.js";

async function run() {
  const { serviceId, phoneNumber, userId, planAmount } = workerData;

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Data Worker connected to DB");

    let result;

    // ---- SAFE API CALL (prevents ECONNABORTED crash)
    try {
      result = await purchaseData(serviceId, phoneNumber);
    } catch (err) {
      console.error("Error purchasing data:", err.message);
      result = {}; // prevent worker crash
    }

    // ---- SAFE ACCESS (no more undefined.data errors)
    const status = result?.data?.status || "failed";
    const message = result?.data?.message || "No response (API timeout)";
    const reference =
      result?.data?.data?.reference || `${serviceId}-${Date.now()}`;

    // Save purchase record
    const purchaseRecord = await PurchaseSchema.create({
      user: userId,
      serviceType: "data",
      amount: planAmount,
      status,
      message,
      reference,
      responseData: result?.data || {},
    });

    // Send plain JSON back
    parentPort.postMessage({
      success: true,
      result: result?.data || {},
      purchaseRecord: purchaseRecord.toObject(),
    });

  } catch (error) {
    console.error("Data Worker Error:", error);
    parentPort.postMessage({ success: false, error: error.message });

  } finally {
    await mongoose.disconnect();
  }
}

run();