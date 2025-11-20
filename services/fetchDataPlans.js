// services/fetchAndStoreDataPlans.js
import axios from "axios";
import providers from "../config/providers.js"; // ✅ make sure this import is here
import DataPlan from "../models/DataPlan.js";
import CablePlan from "../models/CablePlan.js";


export const fetchAndStoreInlomax = async () => {
  const provider = providers.inlomax; // ✅ Now defined

  try {
    const response = await axios.get(
      provider.baseURL + provider.endpoints.data,
      { headers: provider.headers }
    );

    // Use the transformResponse defined in config
    const plans = provider.transformResponse(response.data);
    const cable = provider.transformCableResponse(response.data);
    if (!plans.length || !cable.length) throw new Error("No valid plans found");

    // Optional: Clear old plans before saving
    await DataPlan.deleteMany({});
    await DataPlan.insertMany(plans);
    await CablePlan.deleteMany({});
    await CablePlan.insertMany(cable);

    console.log(`✅ Stored ${plans.length} DataPlans.... Cable ${cable.length}`);
  } catch (err) {
    console.error("❌ Error fetching/storing Inlomax data:", err.message);
  }
};