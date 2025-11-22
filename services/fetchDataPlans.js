// services/fetchAndStoreDataPlans.js
import axios from "axios";
import providers from "../config/providers.js";
import DataPlan from "../models/DataPlan.js";
import CablePlan from "../models/CablePlan.js";

export const fetchAndStoreInlomax = async () => {
  const provider = providers.inlomax;

  try {
    const response = await axios.get(
      provider.baseURL + provider.endpoints.data,
      { headers: provider.headers }
    );

    const plans = provider.transformResponse(response.data);
    const cable = provider.transformCableResponse(response.data);

    if (!plans.length || !cable.length) throw new Error("No valid plans found");

    // Delete old plans
    await DataPlan.deleteMany({});
    await CablePlan.deleteMany({});

    // Save new plans using create()
    await DataPlan.create(plans);
    await CablePlan.create(cable);

    console.log(`✅ Stored ${plans.length} DataPlans.... Cable ${cable.length}`);
  } catch (err) {
    console.error("❌ Error fetching/storing Inlomax data:", err.message);
  }
};