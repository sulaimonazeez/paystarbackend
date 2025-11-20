import axios from "axios";

export const purchaseData = async ( serviceID, phoneNumber ) => {
  try {
    const response = await axios.post(
      "https://inlomax.com/api/data",
      {
        serviceID: serviceID,
        mobileNumber: phoneNumber
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
