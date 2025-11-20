import express from "express";
import { userCreate } from "../controllers/createController.js";
import { userLogin } from "../controllers/loginController.js";
import { body } from "express-validator";


const myRoute = express.Router();
myRoute.post("/create", [body("email").isEmail().withMessage("Email Required"), body("firstName").isString().isLength({min:3}), body("lastName").isString().isLength({min:3}), body("phoneNumber")
  .isString()
  .matches(/^0[7-9][0-1]\d{8}$/)
  .withMessage("Invalid Nigerian phone number"), body("password")
  .isString()
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long")], userCreate);
myRoute.post("/login", [body("email").isEmail().withMessage("Email Required"), body("password").isString().isLength({min:6}).withMessage("Password Required")], userLogin);
export default myRoute;