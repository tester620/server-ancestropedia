import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";

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
    user.updatesleft = 0;
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

export const updatePass = async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = req?.user;
  console.log(user);
  try {
    if (!oldPass || !newPass) {
      return res
        .status(400)
        .json({ message: "Please fill all the required feilds" });
    }
    if (!validator.isStrongPassword(newPass)) {
      return res.status(400).json({
        message: "Please enter a new strong password",
      });
    }
    const isValid = await bcrypt.compare(oldPass, user.password);
    if (!isValid) {
      return res.status(400).json({
        message: "Please enter correct existing password",
      });
    }
    const newPassHash = await bcrypt.hash(newPass, 10);
    user.password = newPassHash;
    await user.save();
    return res.status(200).json({
      message: "Password updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error while updating the password", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
