import pinSchemas from "../models/PinModel.js";

export const PinStatus = async (req, res) =>{
  res.set("Cache-Control", "no-store");

  if (!req.user) {
    return res.status(400).json({message:"User Not Found"});
  }
  const user = await pinSchemas.findOne({user: req.user.id});
  if (user) {
    return res.status(200).json({status:false});
  }
  return res.status(200).json({status: true});
}