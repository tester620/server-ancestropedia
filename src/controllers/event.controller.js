import logger from "../config/logger.js";
import Folder from "../models/folder.model.js";
import Person from "../models/person.model.js";
import Post from "../models/post.model.js";
import { getAllEvents } from "../utils/helper.js";

export const getEvents = async (req, res) => {
  try {
    const { treeId } = req.user;
    const now = new Date();
    
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const folders = await Folder.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const posts = await Post.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    
    let personEvents = [];
    if (treeId) {
      const persons = await Person.find({ treeId });
      personEvents = getAllEvents(persons);
    }

    return res.status(200).json({
      message: "Events fetched successfully",
      data: { folders, posts, personEvents }
    });
  } catch (error) {
    logger.error("Error in getting events", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
