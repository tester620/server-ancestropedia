import User from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const googleAuth = (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    if (err || !user) {
      return res.redirect("/login");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect("/dashboard");
  })(req, res, next);
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

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

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

export const logout = (req, res) => {
  req.session.user = null;
  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export const updatePass = async (req, res) => {
  const { oldPass, newPass } = req.body;
  const user = req?.session?.user;
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
  } catch (error) {
    console.log("Error while updating the password", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
