import { v4 as uuidv4 } from "uuid";
import { FamilyTree } from "../models/ne04j-models/tree.model.js";
import { Person } from "../models/ne04j-models/person.model.js";
import { neogma } from "../config/neo4j.js";


//after creating the tree, add a realtion of the user with the tree and also addTreeId to the person
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

//add person.treeId = treeId after the successfully addition to the tree
export const addPersonToTree = async (req, res) => {
  try {
    const { treeId, personId, relatedToPersonId, role } = req.body;

    if (!treeId || typeof treeId !== "string") {
      return res.status(400).json({
        message: "treeId is required and must be a string",
      });
    }
    if (!personId || typeof personId !== "string") {
      return res.status(400).json({
        message: "personId is required and must be a string",
      });
    }

    const tree = await FamilyTree.findOne({ where: { id: treeId } });
    if (!tree) {
      return res.status(404).json({ message: "FamilyTree not found" });
    }

    const person = await Person.findOne({ where: { id: personId } });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const existingMembership = await neogma.queryRunner.run(
      `MATCH (t:FamilyTree {id: $treeId})-[:HAS_MEMBER]->(p:Person {id: $personId})
       RETURN p`,
      { treeId, personId }
    );
    if (existingMembership.records.length > 0) {
      return res.status(409).json({
        message: "Person already exists in this tree",
      });
    }

    await neogma.queryRunner.run(
      `MATCH (t:FamilyTree {id: $treeId}), (p:Person {id: $personId})
       MERGE (t)-[:HAS_MEMBER]->(p)`,
      { treeId, personId }
    );

    if (role && relatedToPersonId) {
      if (personId === relatedToPersonId) {
        return res.status(400).json({
          message: "Cannot relate a person to themselves",
        });
      }

      const validRoles = ["father", "mother", "child", "spouse"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          message: `Invalid role. Valid roles: ${validRoles.join(", ")}`,
        });
      }

      const relatedInTree = await neogma.queryRunner.run(
        `MATCH (t:FamilyTree {id: $treeId})-[:HAS_MEMBER]->(p:Person {id: $relatedToPersonId})
         RETURN p`,
        { treeId, relatedToPersonId }
      );
      if (relatedInTree.records.length === 0) {
        return res.status(400).json({
          message: "Related person not in this tree",
        });
      }

      if (role === "father" || role === "mother") {
        const existingParent = await neogma.queryRunner.run(
          `MATCH (p:Person {id: $personId})<-[:PARENT_OF]-(parent)
           WHERE parent.gender = ${role === "father" ? "'male'" : "'female'"}
           RETURN parent`,
          { personId }
        );
        if (existingParent.records.length > 0) {
          return res.status(409).json({
            message: `Person already has a ${role}`,
          });
        }

        const existingRelation = await neogma.queryRunner.run(
          `MATCH (p:Person {id: $relatedToPersonId})-[:PARENT_OF]->(c:Person {id: $personId})
           RETURN p`,
          { personId, relatedToPersonId }
        );
        if (existingRelation.records.length > 0) {
          return res.status(409).json({
            message: "Relationship already exists",
          });
        }

        await neogma.queryRunner.run(
          `MATCH (parent:Person {id: $relatedToPersonId}), (child:Person {id: $personId})
           MERGE (parent)-[:PARENT_OF]->(child)`,
          { personId, relatedToPersonId }
        );
      } else if (role === "child") {
        const existingRelation = await neogma.queryRunner.run(
          `MATCH (p:Person {id: $personId})-[:PARENT_OF]->(c:Person {id: $relatedToPersonId})
           RETURN p`,
          { personId, relatedToPersonId }
        );
        if (existingRelation.records.length > 0) {
          return res.status(409).json({
            message: "Relationship already exists",
          });
        }

        await neogma.queryRunner.run(
          `MATCH (parent:Person {id: $personId}), (child:Person {id: $relatedToPersonId})
           MERGE (parent)-[:PARENT_OF]->(child)`,
          { personId, relatedToPersonId }
        );
      } else if (role === "spouse") {
        const existingSpouse = await neogma.queryRunner.run(
          `MATCH (p1:Person {id: $personId})-[:SPOUSE_OF]-(p2:Person {id: $relatedToPersonId})
           RETURN p1`,
          { personId, relatedToPersonId }
        );
        if (existingSpouse.records.length > 0) {
          return res.status(409).json({
            message: "Spouse relationship already exists",
          });
        }

        await neogma.queryRunner.run(
          `MATCH (p1:Person {id: $personId}), (p2:Person {id: $relatedToPersonId})
           MERGE (p1)-[:SPOUSE_OF]-(p2)`,
          { personId, relatedToPersonId }
        );
      }
    }

    return res.status(200).json({
      message: "Person added to family tree successfully",
      data: { treeId, personId },
    });
  } catch (err) {
    console.error("Error in addPersonToTree:", err);
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

export const changeTreeName = async (req, res) => {
  const { newName, treeId } = req.body;
  try {
    if (!newName || !treeId) {
      return res.status(400).json({
        message: "Name and Tree id is required",
      });
    }
    const tree = await FamilyTree.findOne({ where: { id: treeId } });
    if (!tree) {
      return res.status(404).json({
        message: "Tree not found",
      });
    }
    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Unauthorized- Can't change someone's tree name",
      });
    }
    tree.name = `${newName}'s Tree`;
    await tree.save();
    return res.status(200).json({
      message: "Tree name updated successfully",
      data: tree,
    });
  } catch (error) {
    console.log("Error in updating the name of tree", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
