import { v4 as uuidv4 } from "uuid";
import { FamilyTree } from "../models/ne04j-models/tree.model.js";
import { Person } from "../models/ne04j-models/person.model.js";

export const createTree = async (req, res) => {
  try {
    const { ownerId } = req.body;
    if (!ownerId || typeof ownerId !== "string") {
      return res.status(400).json({
        message: "Valid owner id is required",
      });
    }

    const owner = await Person.findOne({ where: { id: ownerId } });
    if (!owner) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    const treeData = {
      name: `${owner.lastName}'s Tree`,
      id: uuidv4(),
      ownerId: ownerId.trim(),
      createdAt: new Date().toISOString(),
    };

    const tree = await FamilyTree.createOne(treeData);

    return res.status(201).json({
      message: "Family tree created successfully",
      data: tree,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export const addPersonToTree = async (req, res) => {
  try {
    const { treeId, personId, relatedToPersonId, role } = req.body;

    if (!treeId || typeof treeId !== "string") {
      return res
        .status(400)
        .json({ message: "treeId is required and must be a string" });
    }
    if (!personId || typeof personId !== "string") {
      return res
        .status(400)
        .json({ message: "personId is required and must be a string" });
    }

    const tree = await FamilyTree.findOne({ where: { id: treeId } });
    if (!tree) {
      return res.status(404).json({ message: "FamilyTree not found" });
    }

    const person = await Person.findOne({ where: { id: personId } });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    await tree.relateTo({
      alias: "members",
      where: { id: personId },
    });

    if (role && relatedToPersonId) {
      const validRoles = ["father", "mother", "child", "spouse"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid role. Must be one of " + validRoles.join(", "),
        });
      }

      const relatedPerson = await Person.findOne({
        where: { id: relatedToPersonId },
      });
      if (!relatedPerson) {
        return res.status(404).json({ message: "Related person not found" });
      }

      if (role === "father" || role === "mother") {
        // (parent)-[:PARENT_OF]->(child)
        await relatedPerson.relateTo({
          alias: "children",
          where: { id: personId },
        });
      } else if (role === "child") {
        // (person)-[:PARENT_OF]->(relatedPerson)
        await person.relateTo({
          alias: "children",
          where: { id: relatedToPersonId },
        });
      } else if (role === "spouse") {
        // (person)-[:SPOUSE_OF]->(relatedPerson)
        await person.relateTo({
          alias: "spouse",
          where: { id: relatedToPersonId },
        });
      }
    }

    return res.status(200).json({
      message: "Person added to family tree successfully",
      data: {
        treeId,
        personId,
      },
    });
  } catch (err) {
    console.error("Error in addPersonToFamilyTree:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getMyTree = async (req, res) => {
  try {
    const tree = await FamilyTree.findOne({
      where: { ownerId: req.user._id.toString() },
    });
    if (!tree) {
      return res.status(404).json({
        message: "Tree not found. Please create a new one",
      });
    }
    return res.status(200).json({
      message: "Tree fetched successfully",
      data: tree,
    });
  } catch (error) {
    console.log("Error in getting my tree", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
