import express from 'express';
import { updateName, updatePass } from '../controllers/profile.controller.js';

const router =express.Router();

router.put("/update-name",updateName);

router.put("/update-pass", updatePass);

export default router