import axios from "axios";
import dotenv from "dotenv";
import User from "../models/UserDb.js";
dotenv.config();

export const createAccount = async (email, name, phoneNumber, ) => {
  const PAYVSSEL_APIKEY = process.env.PAYVSSEL_APIKEY;
const PAYVSSEL_SECRETKEY = process.env.PAYVSSEL_SECRETKEY;
const BUSSINESS_ID = process.env.BUSSINESS_ID

const headers = {
  "api-key": PAYVSSEL_APIKEY,
  "api-secret": `Bearer ${PAYVSSEL_SECRETKEY}`,
  "Content-Type": "application/json"
};

const requestData = {
  email: email,
  name: name,
  phoneNumber: phoneNumber,
  bankcode: ["999991"],
  account_type: "STATIC",
  businessid: BUSSINESS_ID,
  nin: "26053502202"
};
  try {
    const response = await axios.post(
      "https://api.payvessel.com/pms/api/external/request/customerReservedAccount/",
      requestData,
      { headers }
    );

    console.log("Response:", response.data);
    return response;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    return null;
  }
};
