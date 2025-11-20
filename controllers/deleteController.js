import { getRegisteredModels } from "../admin/adminRegistry.js";

export const MyDete = async (req, res) => {
  const { model, id } = req.params;

  try {
    const models = getRegisteredModels();
    const Model = models[model];

    if (!Model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const deleted = await Model.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Deleted successfully", deleted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};