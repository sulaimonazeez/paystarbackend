import pinSchema from "../models/PinModel.js";

export const PinSetUp = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || !req.user) {
      return res.status(400).json({ message: "PIN required" });
    }

    if (pin.length !== 4) {
      return res.status(422).json({ message: "PIN must be exactly 4 digits" });
    }

    const existingPin = await pinSchema.findOne({ user: req.user.id });
    if (existingPin) {
      return res.status(409).json({ message: "PIN already exists" });
    }

    await pinSchema.create({
      user: req.user.id,
      pin: pin,
    });

    return res.status(201).json({ message: "PIN successfully created" });
  } catch (error) {
    console.error("PIN Setup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};