import express from "express";
import {
  addMemberToExistingTree,
  createAndAddPerson,
  createEmptyTree,
  createTreeWithFamily,
  editPerson,
  editTreeDetails,
  getAllRecomendedTrees,
  getFullTree,
  getFullTreeUser,
  removePerson,
} from "../controllers/tree.controller.js";

const router = express.Router();

router.post("/createEmptyTree", createEmptyTree);
router.put("/update", editTreeDetails);
router.put("/update/person", editPerson);
router.post("/createAndAddPerson", createAndAddPerson);
router.delete("/remove/person", removePerson);
router.get("/getFullTree", getFullTree);
router.post("/createTreeWithFamily", createTreeWithFamily);
router.get("/getFullTreeUser", getFullTreeUser);
router.post("/recomended", getAllRecomendedTrees);
router.post("/addMember", addMemberToExistingTree);

export default router;
