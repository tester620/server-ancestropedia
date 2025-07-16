import express from "express";
import {
  getMyDNAOrders,
  getMyTreeOrders,
  placeDnaOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/myDnaOrders", getMyDNAOrders);
router.get("/myTreeOrders", getMyTreeOrders);

router.get("/place", placeDnaOrder);

export default router;
