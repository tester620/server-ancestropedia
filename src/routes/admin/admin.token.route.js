import express from "express";
import {
  allotToken,
  getAllTokenRequests,
  getPendingTokenRequests,
  rejectTokenRequest,
  removeToken,
} from "../../controllers/admin/admin.token.controller.js";

const router = express.Router();

router.get("/pendingRequests", getPendingTokenRequests);
router.get("/getAllTokenRequests", getAllTokenRequests);
router.post("/request/reject", rejectTokenRequest);
router.post("/allotToken", allotToken);
router.post("/token/remove", removeToken);

export default router;
