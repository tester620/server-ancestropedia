import mongoose from "mongoose";
import { Relationship } from "../models/ne04j-models/relationship.model.js";

export const createRelation = async (req, res) => {
  const { fromId, toId, relation } = req.body;
  if (!fromId || !toId || !relation) {
    return res.status(400).json({
      message: "All feilds are required",
    });
  }
  if (
    relation !== "father" &&
    relation !== "mother" &&
    relation !== "child" &&
    relation !== "spouse"
  ) {
    return res.status(400).json({
      message: "Not a valid relation",
    });
  }
  //get fromId from user
  if (!mongoose.isValidObjectId(fromId) || !mongoose.isValidObjectId(toId)) {
    return res.status(400).json({
      message: "Invalid ids",
    });
  }

  try {
    const existingRelation = await Relationship.findOne({
      where: {
        OR: [
          { fromId: toId, toId: fromId },
          { fromId, toId },
        ],
      },
    });

    if (existingRelation) {
      return res.status(400).json({
        message: "Relation already exists",
      });
    }

    const newRelation = await Relationship.createOne({
      fromId,
      toId,
      relation,
    });

    return res.status(201).json({
      message: "Relationship added successfully",
      data: newRelation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
