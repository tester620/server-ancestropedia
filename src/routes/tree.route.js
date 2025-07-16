import express from "express";
import { createTree } from "../controllers/tree.controller.js";

const router = express.Router();

router.post("/create",createTree)

export default router;