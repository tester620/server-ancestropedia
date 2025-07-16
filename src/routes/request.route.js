import express from "express";
import { getRequests, sendRequest } from "../controllers/request.controller.js";

const router = express.Router();

router.get("/getRequests", getRequests);
router.post("/sendRequest", sendRequest);

export default router;
