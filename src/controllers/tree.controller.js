import mongoose from "mongoose";
import logger from "../config/logger.js";
import Person from "../models/person.model.js";
import Tree from "../models/tree.model.js";
import Relation from "../models/relations.model.js";
import { imagekit } from "../config/imagekit.js";
import { redis } from "../config/redis.js";
import { createSpouseRelation } from "./relations.controler.js";

export const createEmptyTree = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ message: "Tree name is required" });
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return res.status(400).json({ message: "Tree name cannot be empty" });
  }

  if (trimmedName.length < 2 || trimmedName.length > 20) {
    return res.status(400).json({
      message: "Tree name must be between 2 and 20 characters",
    });
  }

  try {
    const newTree = new Tree({
      name: trimmedName,
      owner: req.user._id,
      members: [],
    });

    await newTree.save();
    return res.status(201).json({
      message: "Tree created successfully",
      data: newTree,
    });
  } catch (error) {
    logger.error("Error creating empty tree", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createAndAddPerson = async (req, res) => {
  const {
    firstName,
    lastName,
    profession,
    relationStartDate,
    dob,
    dod,
    gender,
    living,
    treeId,
    relatedTo,
    relatedFrom,
    relatedType,
  } = req.body;

  // Validate inputs
  if (!treeId || !mongoose.Types.ObjectId.isValid(treeId)) {
    return res.status(400).json({ message: "Valid tree ID is required" });
  }

  if (!relatedTo && !relatedFrom) {
    return res.status(400).json({
      message: "Either relatedTo or relatedFrom is required",
    });
  }

  if (!profession) {
    return res.status(400).json({
      message: "Profession is requried",
    });
  }
  if (!["father", "mother", "spouse"].includes(relatedType)) {
    return res.status(400).json({ message: "Invalid relation type" });
  }
  if (relatedType === "spouse" && !relationStartDate) {
    return res.status(400).json({
      message: "Relation date cannot be empty",
    });
  }
  if (relatedType === "spouse") {
    await createSpouseRelation({
      husbandId: "",
      wifeId: "",
      date: relationStartDate,
    });
  }

  if (!firstName || !lastName || !dob || living === undefined) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  if (!["male", "female", "other"].includes(gender)) {
    return res.status(400).json({ message: "Invalid gender" });
  }

  if (dod && living) {
    return res.status(400).json({
      message: "Cannot have date of death while marked as living",
    });
  }

  try {
    const tree = await Tree.findById(treeId);
    if (!tree) {
      return res.status(404).json({ message: "Tree not found" });
    }

    if (tree.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only tree owner can add members",
      });
    }

    // Create new person
    const newPerson = new Person({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      profession,
      dob,
      dod: living ? null : dod,
      gender,
      living,
      creatorId: req.user._id,
      treeId,
    });

    await newPerson.save();

    // Update tree members
    tree.members.push(newPerson._id);
    await tree.save();

    // Create relationship
    const newRelation = new Relation({
      to: relatedTo || newPerson._id,
      from: relatedFrom || newPerson._id,
      type: relatedType,
      treeId,
    });

    await newRelation.save();
    const cacheKey = `fullTree:${treeId}`;

    await redis.DEL(cacheKey);

    return res.status(201).json({
      message: "Person added successfully",
      data: {
        person: newPerson,
        relation: newRelation,
      },
    });
  } catch (error) {
    logger.error("Error adding person", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createTreeWithFamily = async (req, res) => {};

export const removePerson = async (req, res) => {
  const { personId, treeId, force = false } = req.body;

  if (!personId || !treeId) {
    return res
      .status(400)
      .json({ message: "Person ID and Tree ID are required" });
  }

  if (
    !mongoose.Types.ObjectId.isValid(personId) ||
    !mongoose.Types.ObjectId.isValid(treeId)
  ) {
    return res.status(400).json({ message: "Invalid IDs provided" });
  }

  try {
    const person = await Person.findById(personId);
    if (!person) return res.status(404).json({ message: "Person not found" });

    const tree = await Tree.findById(treeId);
    if (!tree) return res.status(404).json({ message: "Tree not found" });

    if (!tree.members.includes(personId)) {
      return res.status(400).json({ message: "Person not in specified tree" });
    }

    // Fetch all relationships involving this person
    const relationships = await Relation.find({
      $or: [{ from: personId }, { to: personId }],
      treeId,
    });

    if (relationships.length > 0 && !force) {
      // Warn user with relationship details before deleting
      return res.status(400).json({
        message:
          "Person has existing relationships. Confirm deletion with 'force: true'.",
        relationships: relationships.map((rel) => ({
          id: rel._id,
          from: rel.from,
          to: rel.to,
          type: rel.relationType,
        })),
      });
    }

    // Optional: Detect circular relationships (basic check)
    const involvedInCycle = await Relation.exists({
      from: personId,
      to: personId,
      treeId,
    });

    if (involvedInCycle && !force) {
      return res.status(400).json({
        message:
          "Circular relationship detected. Deletion aborted. Use 'force: true' to proceed.",
      });
    }

    // Remove person from tree members
    tree.members = tree.members.filter((id) => id.toString() !== personId);
    await tree.save();

    // Delete all relationships
    await Relation.deleteMany({
      $or: [{ from: personId }, { to: personId }],
      treeId,
    });

    // Delete person
    await Person.findByIdAndDelete(personId);

    return res
      .status(200)
      .json({ message: "Person and relationships removed successfully." });
  } catch (error) {
    logger.error("Error removing person", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editPerson = async (req, res) => {
  const {
    personId,
    newFirstName,
    newLastName,
    newGender,
    newDob,
    newLiving,
    newProfileImage,
  } = req.body;

  // Validate input
  if (!personId || !mongoose.Types.ObjectId.isValid(personId)) {
    return res.status(400).json({ message: "Valid person ID required" });
  }

  const hasUpdates =
    newFirstName ||
    newLastName ||
    newGender ||
    newDob ||
    newLiving !== undefined ||
    newProfileImage;

  if (!hasUpdates) {
    return res.status(400).json({ message: "No update data provided" });
  }

  try {
    // Find and validate person
    const person = await Person.findById(personId);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    // Check authorization
    if (person.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only creator can edit this person",
      });
    }

    // Apply updates
    if (newFirstName) person.firstName = newFirstName.trim();
    if (newLastName) person.lastName = newLastName.trim();
    if (newGender) person.gender = newGender;
    if (newDob) person.dob = newDob;

    if (newLiving !== undefined) {
      person.living = newLiving;
      if (newLiving) person.dod = null;
    }

    if (newProfileImage) {
      try {
        const uploadRes = await imagekit.upload({
          file: newProfileImage,
          fileName: `${person.firstName}_profile.jpg`,
          folder: "/family-tree-profiles",
        });
        person.profileImage = uploadRes.url;
      } catch (uploadError) {
        logger.error("Image upload failed", uploadError);
        return res.status(500).json({ message: "Profile image update failed" });
      }
    }

    person.updatedAt = Date.now();
    await person.save();

    return res.status(200).json({
      message: "Person updated successfully",
      data: person,
    });
  } catch (error) {
    logger.error("Error editing person", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editTreeDetails = async (req, res) => {
  const { newName, treeId } = req.body;

  if (!newName || typeof newName !== "string") {
    return res.status(400).json({ message: "Valid name is required" });
  }

  const trimmedName = newName.trim();
  if (!trimmedName) {
    return res.status(400).json({ message: "Tree name cannot be empty" });
  }

  if (trimmedName.length < 2 || trimmedName.length > 20) {
    return res.status(400).json({
      message: "Tree name must be between 2 and 20 characters",
    });
  }

  if (!treeId || !mongoose.Types.ObjectId.isValid(treeId)) {
    return res.status(400).json({ message: "Valid tree ID required" });
  }

  try {
    // Find and update tree
    const tree = await Tree.findByIdAndUpdate(
      treeId,
      { name: trimmedName },
      { new: true }
    );

    if (!tree) {
      return res.status(404).json({ message: "Tree not found" });
    }

    return res.status(200).json({
      message: "Tree updated successfully",
      data: tree,
    });
  } catch (error) {
    logger.error("Error editing tree", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFullTree = async (req, res) => {
  const { treeId } = req.query;

  if (!treeId) {
    return res.status(400).json({ message: "Tree ID required" });
  }

  try {
    const cacheKey = `fullTree:${treeId}`;
    const cachedTree = await redis.get(cacheKey);

    if (cachedTree) {
      return res.status(200).json({
        message: "Tree retrieved successfully (cached)",
        data: JSON.parse(cachedTree),
      });
    }

    const tree = await Tree.findById(treeId).populate({
      path: "members",
      model: "Person",
      select: "id firstName lastName dob dod living profileImage gender",
    });

    if (!tree) {
      return res.status(404).json({ message: "Tree not found" });
    }
    const relations = await Relation.find({ treeId });

    const treeData = {
      ...tree.toObject(),
      relations,
    };

    await redis.set(cacheKey, JSON.stringify(treeData), "EX", 3600);

    return res.status(200).json({
      message: "Tree retrieved successfully",
      data: treeData,
    });
  } catch (error) {
    console.error("Error fetching tree", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
