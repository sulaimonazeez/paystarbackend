import pinSchemas from "../models/PinModel.js";

export const PinUpdate = async (req, res) =>{
  try {
    const { oldPin, newPin } = req.body;
    if (!oldPin || !newPin) {
      return res.status(400).json({message:"Invalid Pin Provided"});
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({message:"Unauthorized Token"})
    }
    const user = await pinSchemas.findOne({user:req.user.id});
    if (!user) {
      return res.status(404).json({message:"User not found"});
    }
    if (user.pin !== oldPin) {
      return res.status(401).json({message:"Invalid Pin"})
    }
    user.pin = newPin;
    await user.save();
    return res.status(200).json({message:"Pin Updated Successful"})
  } catch (err) {
    return res.status(500).json({message:"Internal Server Occured"})
  }
}