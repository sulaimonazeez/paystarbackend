import PurchaseSchema from "../models/PurchaseSchema.js";

export const inlomaxWebhook = async (req, res) =>{
  try {
    const payload = req.body;
    let status = payload.status;
    let message = payload.message || "Request Submitted";
    let reference = payload.data.reference
    if (payload.status === "error") {
      status = "failed";
    }
    
    await PurchaseSchema.create({
          user: req.user.id,
          serviceType: payload.data.type,
          amount: payload.data.amount,
          status,
          message,
          reference: reference,
          responseData: payload?.data || {},
        });
    return res.status(200).json({messages:"Event Recived"});
  } catch (error) {
    return res.status(500).json({message:"Error Occured"})
  }
}