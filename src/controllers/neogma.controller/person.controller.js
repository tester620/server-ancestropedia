import { v4 as uuidv4 } from "uuid";
import { Person } from "../../models/ne04j-models/person.model.js";
import { FamilyTree } from "../../models/ne04j-models/tree.model.js";

export const createPerson = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Invalid payload" });
    }
    const requiredFields = ["firstName", "lastName", "dob", "gender", "living"];
    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        return res.status(400).json({ message: `Missing or invalid ${field}` });
      }
    }
    if (typeof data.firstName !== "string" || data.firstName.length > 50) {
      return res.status(400).json({ message: "Invalid firstName" });
    }
    if (typeof data.lastName !== "string" || data.lastName.length > 50) {
      return res.status(400).json({ message: "Invalid lastName" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) {
      return res
        .status(400)
        .json({ message: "Invalid dob format, expected YYYY-MM-DD" });
    }
    if (data.living !== true && data.living !== false) {
      return res.status(400).json({ message: "Invalid living status" });
    }
    if (data.dod && !/^\d{4}-\d{2}-\d{2}$/.test(data.dod)) {
      return res.status(400).json({ message: "Invalid date of death format" });
    }
    if (data.dod && data.living === true) {
      return res.status(400).json({
        message: "Living cannot be true if date of death is provided",
      });
    }
    if (data.profileImage && typeof data.profileImage !== "string") {
      return res.status(400).json({ message: "Invalid profileImage" });
    }
    if (!["male", "female", "other"].includes(data.gender.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const personData = {
      id: uuidv4(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dob: data.dob,
      living: data.living,
      gender: data.gender.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (data.dod) personData.dod = data.dod;
    if (data.profileImage) personData.profileImage = data.profileImage.trim();

    const person = await Person.createOne(personData);

    res.status(201).json({
      message: "Person profile created successfully",
      data: person,
    });
  } catch (error) {
    console.error("Error in creating person", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOwner = async (req, res) => {
  const user = req.user;
  const { dob, gender } = req.body;
  try {
    if (!dob || !gender) {
      return res.status(400).json({
        message: "All the feilds are required",
      });
    }
    if (!["male", "female", "other"].includes(gender.toLowerCase())) {
      return res.status(400).json({ message: "Invalid gender" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res
        .status(400)
        .json({ message: "Invalid dob format, expected YYYY-MM-DD" });
    }
    const personData = {
      id: user._id.toString(),
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      dob: dob,
      living: true,
      profileImage: user.profilePicture,
      gender: gender.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const person = await Person.createOne(personData);
    return res.status(201).json({
      message: "Owner created",
      data: person,
    });
  } catch (error) {
    console.log("Error in creating owner", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const treeMergeController = async (req, res) => {
  const { data } = req.body;
  try {
    if (!data || typeof data !== "object")
      return res.status(400).json({ error: "invalid data" });

    const { parentsName, grandParentsName } = data;
    if (
      !parentsName?.fatherFirstName ||
      !parentsName?.fatherLastName ||
      !parentsName?.fatherDOB ||
      !parentsName?.motherFirstName ||
      !parentsName?.motherLastName ||
      !parentsName?.motherDOB ||
      !grandParentsName?.gfFirstName ||
      !grandParentsName?.gfLastName ||
      !grandParentsName?.gfDOB ||
      !grandParentsName?.gmFirstName ||
      !grandParentsName?.gmLastName ||
      !grandParentsName?.gmDOB ||
      !grandParentsName?.maternalGfFirstName ||
      !grandParentsName?.maternalGfLastName ||
      !grandParentsName?.maternalGfDOB ||
      !grandParentsName?.maternalGmFirstName ||
      !grandParentsName?.maternalGmLastName ||
      !grandParentsName?.maternalGmDOB
    ) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const candidates = [
      {
        firstName: parentsName.fatherFirstName,
        lastName: parentsName.fatherLastName,
        dob: parentsName.fatherDOB,
        isDeceased: parentsName.fatherIsDeceased,
      },
      {
        firstName: parentsName.motherFirstName,
        lastName: parentsName.motherLastName,
        dob: parentsName.motherDOB,
        isDeceased: parentsName.motherIsDeceased,
      },
      {
        firstName: grandParentsName.gfFirstName,
        lastName: grandParentsName.gfLastName,
        dob: grandParentsName.gfDOB,
        isDeceased: grandParentsName.gfIsDeceased,
      },
      {
        firstName: grandParentsName.gmFirstName,
        lastName: grandParentsName.gmLastName,
        dob: grandParentsName.gmDOB,
        isDeceased: grandParentsName.gmIsDeceased,
      },
      {
        firstName: grandParentsName.maternalGfFirstName,
        lastName: grandParentsName.maternalGfLastName,
        dob: grandParentsName.maternalGfDOB,
        isDeceased: grandParentsName.maternalGfIsDeceased,
      },
      {
        firstName: grandParentsName.maternalGmFirstName,
        lastName: grandParentsName.maternalGmLastName,
        dob: grandParentsName.maternalGmDOB,
        isDeceased: grandParentsName.maternalGmIsDeceased,
      },
    ];

    let foundPerson = null;
    for (const c of candidates) {
      const match = await Person.findOne({
        where: {
          firstName: c.firstName,
          lastName: c.lastName,
          dob: c.dob,
        },
      });
      if (match) {
        foundPerson = match;
        break;
      }
    }

    console.log(foundPerson);
    if (foundPerson && foundPerson.treeId) {
      const existingTree = await FamilyTree.findOne({
        where: { id: foundPerson.treeId },
      });
      const currentCreatedTree = null;
      return res
        .status(200)
        .json({ existingTree, currentCreatedTree, mergeAvailable: true });
    }

    // const currentCreatedTree = await TempTree.createOne({ data })
    return res
      .status(200)
      .json({ message: "Tree not found", mergeAvailable: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
