import express from "express";
import {
  getMyAddresses,
  addAddress,
  updateAddress,
  removeAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/add", addAddress);
router.get("/myAddresses", getMyAddresses);
router.put("/update", updateAddress);
router.delete("/remove", removeAddress);

export default router;
