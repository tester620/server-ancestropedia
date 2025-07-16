import express from "express";
import {
  addFamilyMember,
  createTree,
  editFamilyMember,
  getFamilyMember,
  getMyRelation,
  newRelation,
  removeFamilyMember,
  viewFamilyMember,
} from "../controllers/sample.tree.controller.js";

const router = express.Router();

router.post("/create", createTree);
router, get("/getMember", getFamilyMember);
router.post("/addMember", addFamilyMember);
router.put("/editFamilyMember", editFamilyMember);
router.get("/viewFamilyMember", viewFamilyMember);
router.put("/removeFamilyMember", removeFamilyMember);
router.get("/getMyRelation", getMyRelation);
router.post("/newRelation", newRelation);

export default router;
