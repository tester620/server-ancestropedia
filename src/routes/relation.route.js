import express from 'express'
import { createRelation } from '../controllers/relationship.controller.js';

const router = express.Router();

router.post("/create",createRelation)

export default router;