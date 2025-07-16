import mongoose, { mongo } from "mongoose";
import FamilyTree from "../models/ne04j-models/tree.model";
import { Relationship } from "neo4j-driver";

export const createTree = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data) {
      return res.status(400).json({
        message: "Data is required to create a tree",
      });
    }
    if (
      !data.motherName ||
      !data.fatherName ||
      !data.grandFatherName ||
      !data.grandMotherName ||
      !data.dob ||
      !data.grandMotherDob ||
      !data.grandFatherDob ||
      !data.motherDob ||
      !data.fatherDob
    ) {
      return res.status(400).json({
        message: "All feilds are required",
      });
    }
    const newFamilyTree = new FamilyTree({
      data,
    });
    // const exisitingFamilyTreeMatch = await FamilyTree.find({find any existing trees})
    if (!exisitingFamilyTree) {
      return res.status(404).json({
        message: "No familyTree found. It is better to cerate a new one",
      });
    }
    return res.status(200).json({
      message: "Exisiting Family Tree fetched",
      data: exisitingFamilyTree,
    });
  } catch (error) {
    console.log("Error in creating familyTree", error);
    return res.status(500).json({
      message: "Internal Sever Error",
    });
  }
};

export const addFamilyMember = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Member Added Successfully",
    });
  } catch (error) {
    console.log("Error in adding Family Member", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeFamilyMember = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Member Removed Successfully",
    });
  } catch (error) {
    console.log("Error in removing Family Member", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const editFamilyMember = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Member Edited Successfully",
    });
  } catch (error) {
    console.log("Error in editing Family Member", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const viewFamilyMember = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Member Viewed Successfully",
    });
  } catch (error) {
    console.log("Error in viewing Family Member", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getFamilyMember = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "Please provide the user id",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid User Id ",
      });
    }
    const member = await FamilyTree.findById(userId);
    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }
    return res.status(200).json({
      message: "Member feftched successfully",
      data: member,
    });
  } catch (error) {
    console.log("Error in fetching the member details", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getMyRelation = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "User id is required",
      });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid User Id",
      });
    }

    const relation = await Relationship.findOne({
      from: userId,
      to: req.user._id,
    });
    if (!relation) {
      return res.status(404).json({
        message: "Relation not found",
      });
    }
    return res.status(200).json({
      message: "Relation found successfully",
      data: relation,
    });
  } catch (error) {
    console.log("Error in fetching realtion", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const newRelation = async (req, res) => {
  const { userId, data } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "User Id is required",
      });
    }
    if (!mongo.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "inavlid User Id",
      });
    }
    const newRelation = new Relationship({
      data,
    });
    await newRelation.save();
    return re.status(201).json({
      message: "New Relation Created",
      data: newRelation,
    });
  } catch (error) {
    console.log("Error in creating new relation", error);
    return res.status(500).json({
      message: "Internal Server Erro",
    });
  }
};
