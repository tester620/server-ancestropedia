import express from "express";
import {
  addPersonToTree,
  changeTreeName,
  createTree,
  getMyTree,
} from "../../controllers/tree.controller.js";
import { createOwner } from "../../controllers/neogma.controller/person.controller.js";

const router = express.Router();

router.post("/create", createTree);
router.post("/create/owner", createOwner);
router.post("/addMember", addPersonToTree);
router.get("/myTree", getMyTree);
router.put("/update", changeTreeName);

export default router;
