import express from 'express';
import { getMyData, updateName, updatePass } from '../controllers/profile.controller.js';

const router =express.Router();

router.put("/update-name",updateName);

router.put("/update-pass", updatePass);

router.get("/myData", getMyData);


export default router