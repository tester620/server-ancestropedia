import { v4 as uuidv4 } from "uuid";
import FamilyTree from "../models/ne04j-models/tree.model.js";
import Person from "../models/ne04j-models/person.model.js";
import { neogma } from "../config/neo4j.js";

export const createTree = async (req, res) => {
  const user = req.user;

  try {
    const treeId = uuidv4();
    const personId = uuidv4();

    // Create transaction for atomic operations
    const result = await neogma.queryRunner.runInTransaction(async (tx) => {
      // Create Family Tree node
      const newTree = await FamilyTree.createOne(
        {
          id: treeId,
          name: `${user.lastName}'s Tree`,
          createdBy: user._id.toString(),
          createdAt: new Date().toISOString(),
        },
        { transaction: tx }
      );

      // Create Person node
      const personNode = await Person.createOne(
        {
          id: personId,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender || "",
          dob: user.dob || "",
          birthplace: user.birthplace || "",
          createdBy: user._id.toString(),
        },
        { transaction: tx }
      );

      // Create BELONGS_TO relationship
      await personNode.relateTo(
        {
          alias: "belongsTo",
          where: {
            id: newTree.id,
          },
        },
        { transaction: tx }
      );

      return { newTree, personNode };
    });

    res.status(201).json({
      message: "Family tree created successfully",
      tree: result.newTree,
      rootPerson: result.personNode,
    });
  } catch (error) {
    console.error("Create Tree Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};