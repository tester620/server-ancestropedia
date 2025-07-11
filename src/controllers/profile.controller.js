import User from "../models/user.model.js";

export const updateName = async (req, res) => {
  const { newName } = req.body;
  if (!newName) {
    return res.status(400).json({
      message: "Name is required",
    });
  }
  const user = req.user;
  if (user.updatesleft < 1) {
    return res.status(400).json({
      message: "Update limit reached",
    });
  }
  try {
    user.firstName = newName.firstName;
    user.lastName = newName.lastName;
    await User.save();
    req.user = user;
    return res.status(200).json({
      message: "Name updated successfully",
    });
  } catch (error) {
    console.log("Error in updating name", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
