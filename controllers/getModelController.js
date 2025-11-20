import { getRegisteredModels } from "../admin/adminRegistry.js";


export const GetModel = async (req, res) =>{
  const { modelName } = req.params;
  const models = getRegisteredModels();
  const model = models[modelName];

  if (!model) return res.status(404).json({ message: "Model not found" });

  const data = await model.find();
  res.json(data);
}