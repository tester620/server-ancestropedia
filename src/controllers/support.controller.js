import SupportMessage from "../models/support.model.js";
import validator from "validator";
export const submitMessage = async (req, res) => {
  const { email, name, message } = req.body;
  try {
    if (!email || !name || !message) {
      return res.status(400).json({
        message: "PLease fill all the required feilds",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }
    if (name.length > 20 || name.length < 3) {
      return res.status(400).json({
        message: "Name should be between 3 and 20 characters",
      });
    }
    if (message.length > 300) {
      return res.status(400).json({
        message: "Message should be atmax 300 characters long",
      });
    }
    const newMessage = new SupportMessage({
      message,
      email,
      name,
    });

    await newMessage.save();
    return res.status(201).json({
      message: "Support message created successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("Error in submiiting the support message", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
