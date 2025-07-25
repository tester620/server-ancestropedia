import express from "express";
import {
  allotToken,
  getTokenRequests,
  removeToken,
  reviewTokenRequest,
} from "../../controllers/admin/admin.token.controller.js";

const router = express.Router();

router.get("/requests", getTokenRequests);
router.post("/request/review", reviewTokenRequest);
router.post("/allotToken", allotToken);
router.post("/token/reset", removeToken);

export default router;
