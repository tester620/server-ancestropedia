import express from "express";
import { createTokenRequest, getMyTokenRequests, getSpecificTokenRequest } from "../controllers/user.token.controller.js";

const router = express.Router();

router.get("/myTokenRequests",getMyTokenRequests);
router.post("/createTokenRequest",createTokenRequest);
router.get("/getSpecificTokenRequest",getSpecificTokenRequest);

export default router;
