import express from "express";
import { createPerson, treeMergeController } from "../../controllers/neogma.controller/person.controller.js";

const router = express.Router();

router.post("/create", createPerson);
router.post("/searchAndMerge",treeMergeController);


export default router;
