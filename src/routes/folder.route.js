import express from "express";
import {
  getFolderData,
  addPosts,
  createFolder,
  getMyFolders,
  removeFolder,
  updateFolder,
  removeFiles,
  createInFolder,
} from "../controllers/folder.controller.js";

const router = express.Router();

router.post("/create", createFolder);
router.get("/myFolders", getMyFolders);
router.put("/updateFolder", updateFolder);
router.post("/addPosts", addPosts);
router.get("/data", getFolderData);
router.delete("/removeFolder", removeFolder);
router.patch("/removefiles", removeFiles);
router.post("/createInFolder",createInFolder)

export default router;
