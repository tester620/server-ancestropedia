import { v4 as uuidv4 } from "uuid";
import { FamilyTree } from "../../models/ne04j-models/tree.model.js";
import { Person } from "../../models/ne04j-models/person.model.js";
import { neogma } from "../../config/neo4j.js";
import { redis } from "../../config/redis.js";

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
    await neogma.queryRunner.run(
      `MATCH (p:Person {id: $personId}) SET p.treeId = $treeId`,
      { personId, treeId }
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

      let relatedInTree;
      if (relatedToPersonId === tree.ownerId) {
        relatedInTree = { records: [{}] };
      } else {
        relatedInTree = await neogma.queryRunner.run(
          `MATCH (t:FamilyTree {id: $treeId})-[:HAS_MEMBER]->(p:Person {id: $relatedToPersonId})
           RETURN p`,
          { treeId, relatedToPersonId }
        );
      }
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
    const cacheKey = `tree:${req.user._id.toString()}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Tree fetched successfully (from cache)",
        data: JSON.parse(cachedData),
      });
    }
    const tree = await FamilyTree.findOne({
      where: { ownerId: req.user._id.toString() },
    });

    if (!tree) {
      return res.status(404).json({
        message: "Tree not found. Please create a new one",
      });
    }
    await redis.set(cacheKey, JSON.stringify(tree), "EX", 360);
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

export const getMyCompleteTree = async (req, res) => {
  try {
    const cacheKey = `completeTree:${req.user._id.toString()}`;
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Tree successfully fetched (from cache)",
        data: JSON.parse(cachedData),
      });
    }

    const myTree = await FamilyTree.findOne({
      where: { ownerId: req.user._id.toString() },
    });
    if (!myTree) {
      return res.status(404).json({
        message: "Tree not found. Please create a new one",
      });
    }

    const treeId = myTree.id;

    const result = await neogma.queryRunner.run(
      `
      MATCH (t:FamilyTree {id: $treeId})-[:HAS_MEMBER]->(member:Person)
      OPTIONAL MATCH path = (member)-[:PARENT_OF|SPOUSE_OF*0..5]-(other:Person)
      WITH collect(DISTINCT member) + collect(DISTINCT other) as people, collect(DISTINCT relationships(path)) as relations
      UNWIND people as person
      RETURN collect(DISTINCT person) as allPeople, apoc.coll.flatten(relations) as allRelations
      `,
      { treeId }
    );

    const allPeople = result.records?.[0]?.get("allPeople") || [];
    const allRelations = result.records?.[0]?.get("allRelations") || [];

    const responseData = {
      people: allPeople,
      relations: allRelations,
    };
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 3600);

    return res.status(200).json({
      message:
        "Family tree with all members and relationships fetched successfully",
      data: responseData,
    });
  } catch (error) {
    console.log("Error in getting the complete tree", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
