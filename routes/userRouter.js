import express from "express";
import { userCreate } from "../controllers/createController.js";
import { userLogin } from "../controllers/loginController.js";
import { body } from "express-validator";
import User from "../models/UserDb.js";
const myRoute = express.Router();
myRoute.post("/create", [body("email").isEmail().withMessage("Email Required"), body("firstName").isString().isLength({min:3}), body("lastName").isString().isLength({min:3}), body("phoneNumber")
  .isString()
  .matches(/^0[7-9][0-1]\d{8}$/)
  .withMessage("Invalid Nigerian phone number"), body("password")
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")], userCreate);
myRoute.post("/login", [body("email").isEmail().withMessage("Email Required"), body("password").isString().isLength({min:6}).withMessage("Password Required")], userLogin);
myRoute.get("/admin", async (req, res) => {
  try {
    const user = await User.findOne({ email: "janeazeez@gmail.com" });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save(); // ✅ important to await

    // prevent caching issues
    res.set("Cache-Control", "no-store");

    return res.json({ message: "User role updated to admin" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});
export default myRoute;