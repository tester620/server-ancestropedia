import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    if (
      !firstName ||
      !lastName ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill all the feilds",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Enter a strong password",
      });
    }

    const existingUser = await User.findOne({
      email,
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await user.save();
    generateToken(user._id, res);
    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error while registering user", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const logout = (_, res) => {
  try {
    res.cookie("jwt", null, {
      expires: new Date(Date.now()),
      sameSite: "None",
      secure: true,
    });

    return res
      .status(200)
      .json({ status: "success", message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    console.log(password,user?.password)
    const isValid = await bcrypt.compare(password, user?.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }
    generateToken(user._id, res);

    return res.status(200).json({
      message: "Logged in Successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error while loggin in", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};



