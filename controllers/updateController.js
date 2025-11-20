import { getRegisteredModels } from "../admin/adminRegistry.js";

export const updateRecord = async (req, res) => {
  const { model, id } = req.params;
  const updateData = req.body; // fields to update

  try {
    const models = getRegisteredModels();
    const Model = models[model];

    if (!Model) {
      return res.status(404).json({ message: "Model not found" });
    }

    const updated = await Model.findByIdAndUpdate(id, updateData, {
      new: true,        // return updated document
      runValidators: true, // validate before update
    });

    if (!updated) {
      return res.status(404).json({ message: `${model} record not found` });
    }

    res.json({
      message: `${model} updated successfully`,
      updated,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};