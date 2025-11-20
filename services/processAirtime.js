import axios from "axios";

export const purchaseAirtime = async ( serviceID, phoneNumber, amount) => {
  try {
    const response = await axios.post(
      "https://inlomax.com/api/airtime",
      {
        serviceID: serviceID,
        mobileNumber: phoneNumber,
        amount: amount
      },
      {
        headers: {
          Authorization: "Token 3bfi9t7sg5sr3nbsptygrnnwbvl676yhi0u30rdy",
          "Content-Type": "application/json"
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error purchasing data:", error.response?.data || error.message);
  }
};
