import validator from "validator";
import Address from "../models/address.model.js";
import mongoose from "mongoose";

export const addAddress = async (req, res) => {
  const {
    name,
    mobile,
    pincode,
    locality,
    address,
    city,
    state,
    addressType,
    landmark,
  } = req.body;

  if (
    !name ||
    !mobile ||
    !pincode ||
    !locality ||
    !address ||
    !city ||
    !state ||
    !addressType ||
    !landmark
  ) {
    return res.status(400).json({
      message: "All the fields are required",
    });
  }

  if (!validator.isMobilePhone(mobile, "en-IN")) {
    return res.status(400).json({
      message: "Please enter a valid mobile number",
    });
  }

  if (!validator.isPostalCode(pincode.toString(), "IN")) {
    return res.status(400).json({
      message: "Please enter a valid pincode",
    });
  }

  if (!validator.isLength(name, { min: 2 }) || !/^[a-zA-Z\s]+$/.test(name)) {
    return res.status(400).json({
      message: "Please enter a valid name",
    });
  }

  if (!validator.isLength(address, { min: 5 })) {
    return res.status(400).json({
      message: "Please enter a valid address",
    });
  }

  if (!/^[a-zA-Z\s]+$/.test(city)) {
    return res.status(400).json({
      message: "Please enter a valid city",
    });
  }

  if (!/^[a-zA-Z\s]+$/.test(state)) {
    return res.status(400).json({
      message: "Please enter a valid state",
    });
  }

  const validTypes = ["home", "work"];
  if (!validTypes.includes(addressType)) {
    return res.status(400).json({
      message: "Please enter a valid address type",
    });
  }

  if (!validator.isLength(landmark, { min: 2 })) {
    return res.status(400).json({
      message: "Please enter a valid landmark",
    });
  }

  try {
    const addressDoc = new Address({
      name,
      userId: req.user._id,
      mobile,
      pincode,
      locality,
      address,
      city,
      state,
      addressType,
      landmark,
      user: req.user._id,
    });
    await addressDoc.save();
    return res.status(201).json({
      message: "Address added successfully",
      data: addressDoc,
    });
  } catch (error) {
    console.log("Error in adding the address feild", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    if (!addresses || !addresses.length) {
      return res.status(404).json({
        message: "No Adrress found",
      });
    }
    return res.status(200).json({
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (error) {
    console.log("Error in getting my addresses", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateAddress = async (req, res) => {
  const { addressId } = req.query;
  const { updatedData } = req.body;

  if (!updatedData) {
    return res.status(400).json({
      message: "Updated data is required",
    });
  }

  if (!addressId || !mongoose.isValidObjectId(addressId)) {
    return res.status(400).json({
      message: "Valid address id is required",
    });
  }

  const allowedFields = [
    "name",
    "mobile",
    "pincode",
    "locality",
    "address",
    "city",
    "state",
    "addressType",
    "landmark",
  ];

  const updateKeys = Object.keys(updatedData);
  const isValidUpdate = updateKeys.every((key) => allowedFields.includes(key));

  if (!isValidUpdate) {
    return res.status(400).json({
      message: "Invalid updates! Only allowed fields can be updated.",
    });
  }

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }
    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized- Can't edit someone's address",
      });
    }

    updateKeys.forEach((key) => {
      address[key] = updatedData[key];
    });

    await address.save();

    return res.status(200).json({
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    console.log("Error in updating the address", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeAddress = async (req, res) => {
  const { addressId } = req.query;
  try {
    if (!addressId || !mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        message: "Valid address Id is required",
      });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        message: "Address not found to remove",
      });
    }
    if (address.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized- Can't remove someone's address",
      });
    }

    await Address.findByIdAndDelete(addressId);
    return res.status(202).json({
      message: "Address has been removed",
    });
  } catch (error) {
    console.log("Error in removing the address", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
