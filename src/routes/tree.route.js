import express from "express";
import {
  createAndAddPerson,
  createEmptyTree,
  editPerson,
  editTreeDetails,
  getFullTree,
  removePerson,
} from "../controllers/tree.controller.js";

const router = express.Router();

router.post("/createEmptyTree", createEmptyTree);
router.put("/update", editTreeDetails);
router.put("/update/person", editPerson);
router.post("/createAndAddPerson", createAndAddPerson);
router.delete("/remove/person", removePerson);
router.get("/getFullTree", getFullTree);

export default router;
