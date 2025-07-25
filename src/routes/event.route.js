import express from "express";
import { getEvents } from "../controllers/event.controller.js";

const router = express.Router();

router.get("/getEvents", getEvents);
export default router;
