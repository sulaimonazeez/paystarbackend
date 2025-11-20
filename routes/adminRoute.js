import { isAdmin } from "../middleware/roleMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
//import { dashboard } from "../controllers/adminController.js";
import { AdminModelController } from "../controllers/adminModelController.js";
import { GetModel } from "../controllers/getModelController.js";
import { MyDete } from "../controllers/deleteController.js";
import { updateRecord } from "../controllers/updateController.js";




import express from "express";
const adminRoute = express.Router();
//adminRoute.get("/admin/dashboard", verifyToken, isAdmin, dashboard);
adminRoute.get("/admin", verifyToken, isAdmin, AdminModelController);
adminRoute.get("/model/:modelName", verifyToken, isAdmin, GetModel);
adminRoute.delete("/model/:model/:id", verifyToken, isAdmin, MyDete);
adminRoute.put("/model/:model/:id", verifyToken, isAdmin, updateRecord);

export default adminRoute;
