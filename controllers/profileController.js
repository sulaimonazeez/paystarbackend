import User from "../models/UserDb.js";

export const myProfile = async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const users = await User.findOne({ email:req.user.email});
    res.json({
      firstname: users.firstName,
      lastname: users.lastName,
      email: users.email,
      phone: users.phoneNumber,
      createdAt: users.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};