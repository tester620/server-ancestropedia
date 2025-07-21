import express from "express";
import {
  addPersonToTree,
  changeTreeName,
  createTree,
  getMyCompleteTree,
  getMyTree,
} from "../../controllers/neogma.controller/tree.controller.js";
import { createOwner } from "../../controllers/neogma.controller/person.controller.js";

const router = express.Router();

router.post("/create", createTree);
router.get("/completeFamilyTree", getMyCompleteTree);
router.post("/create/owner", createOwner);
router.post("/addMember", addPersonToTree);
router.get("/myTree", getMyTree);
router.put("/update", changeTreeName);

export default router;
