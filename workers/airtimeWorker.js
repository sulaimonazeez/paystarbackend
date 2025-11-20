import { parentPort, workerData } from "worker_threads";
import mongoose from "mongoose";
import { purchaseAirtime } from "../services/processAirtime.js";
import PurchaseSchema from "../models/PurchaseSchema.js";

async function run() {
  const { serviceId, phoneNumber, amount, userId } = workerData;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 seconds
    });
    console.log("Worker connected to DB");

    const result = await purchaseAirtime(serviceId, phoneNumber, amount);

    const purchaseRecord = await PurchaseSchema.create({
      user: userId,
      serviceType: "airtime",
      status: result.data?.status || "failed",
      message: result.data?.message || "No response message",
      reference: result.data?.data?.reference || serviceId + "-" + Date.now(),
      responseData: result.data || {},
    });

    // Send plain objects only
    parentPort.postMessage({
      success: true,
      result: result.data || {},
      purchaseRecord: purchaseRecord.toObject(), // convert mongoose doc to plain object
    });

  } catch (error) {
    console.error("Airtime Worker Error:", error);
    parentPort.postMessage({ success: false, error: error.message });
  } finally {
    await mongoose.disconnect();
  }
}

run();