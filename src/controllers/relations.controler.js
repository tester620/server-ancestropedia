import mongoose from "mongoose";
import Marriage from "../models/marriage.model.js";
import logger from "../config/logger.js";

export const createSpouseRelation = async (data) => {
  const { husbandId, wifeId, date } = data;
  try {
    if (
      !husbandId ||
      !wifeId ||
      !date ||
      !mongoose.isValidObjectId(husbandId) ||
      !mongoose.isValidObjectId(wifeId)
    ) {
      return;
    }

    const newMarriage = new Marriage({
      spouseA: husbandId,
      spouseB: wifeId,
      date,
    });
    await newMarriage.save();
    return newMarriage;
  } catch (error) {
    logger.error("Error in creating new Marriage relation");
  }
};

export const createSpouseDivorce = async(req,res)=>{
    
}
