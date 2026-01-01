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
import cookieParser from "cookie-parser";

connectDb();

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false, // disable CSP for dev
  })
);app.use(
  cors({
    origin: true, // allows all origins dynamically
    credentials: true,
  })
);


app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoute);
app.use(myRoute);
app.use(adminRoute);

app.listen(5000, () => {
  console.log("✅ Server running on port 8000...");
});
