import logger from "../config/logger.js";
import Marriage from "../models/marriage.model.js";
import Person from "../models/person.model.js";
import { getAllEvents } from "../utils/helper.js";

export const getEvents = async (req, res) => {
  const { treeId } = req.user;

  if (!treeId) {
    return res.status(400).json({
      message: "You don't have the tree with your profile yet.",
    });
  }

  try {
    const persons = await Person.find({ treeId });
    const personIds = persons.map((person) => person._id);

    const marriages = await Marriage.find({
      $or: [{ spouseA: { $in: personIds } }, { spouseB: { $in: personIds } }],
    });

    const data = getAllEvents(persons, marriages,treeId);

    return res.status(200).json({
      message: "Events fetched successfully",
      data,
    });
  } catch (error) {
    logger.error("Error in getting all the events", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
