export default {
  inlomax: {
    baseURL: "https://inlomax.com/api",
    endpoints: { 
      data: "/services",
      cable: "/cable"      // 👈 Add the cable TV endpoint here
    },
    headers: {
      Authorization: "Token 3bfi9t7sg5sr3nbsptygrnnwbvl676yhi0u30rdy",
      "Content-Type": "application/json",
    },

    // Transform DATA PLANS (already good)
    transformResponse: (response) => {
      if (!response || response.status !== "success" || !response.data?.dataPlans?.length) {
        console.log("⚠️ Invalid or empty Inlomax dataPlans");
        return [];
      }

      const plans = response.data.dataPlans.map((item) => ({
        provider: "inlomax",
        network: item.network || "",
        serviceID: item.serviceID,
        dataPlan: item.dataPlan,
        amount: parseFloat(String(item.amount).replace(/,/g, "")),
        dataType: item.dataType || "",
        validity: item.validity || "",
        endpoint: "inlomax/services",
        config: item,
      }));

      return plans;
    },

    // 👇 NEW: Transform Cable TV Plans
    transformCableResponse: (response) => {
      if (!response || response.status !== "success" || !response.data?.cablePlans?.length) {
        console.log("⚠️ Invalid or empty Inlomax cablePlans");
        return [];
      }

      return response.data.cablePlans.map((item) => ({
        provider: "inlomax",
        serviceID: item.serviceID,
        cablePlan: item.cablePlan,
        cable: item.cable,
        amount: parseFloat(String(item.amount).replace(/,/g, "")),
        discount: item.discount ? Number(item.discount) : 0,
      }));
    },
  },
};