import { getRegisteredModels } from "../admin/adminRegistry.js";

export const AdminModelController = (req, res) =>{
  const models = Object.keys(getRegisteredModels());
  res.json(models);
}

