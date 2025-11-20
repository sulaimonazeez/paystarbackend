import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDb from "./config/db.js";
import morgan from "morgan";
import cors from "cors";
import myRoute from "./routes/userRouter.js";
import authRoute from "./routes/authRouter.js";
import adminRoute from "./routes/adminRoute.js";

import cron from "node-cron";
import { fetchAndStoreInlomax } from "./services/fetchDataPlans.js";
import User from "./models/UserDb.js";
import helmet from "helmet";
connectDb();

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP for dev
  })
);
app.use(cors({ origin: '*' }));


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use(myRoute);
app.use(adminRoute);

app.listen(5000, () => {
  console.log("✅ Server running on port 8000...");
});



(async () => {
  try {
    console.log("⏰ Running initial fetch...");
    await fetchAndStoreInlomax("inlomax");
    console.log("✅ Initial fetch completed!");
  } catch (err) {
    console.error("❌ Initial fetch failed:", err.message);
  }
})();

cron.schedule("0 0 */2 * *", async () => {
  console.log("⏰ Starting 2-day sync...");
  try {
    await fetchAndStoreInlomax("inlomax");
    console.log("✅ Background sync completed!");
  } catch (err) {
    console.error("❌ Background sync failed:", err.message);
  }
});