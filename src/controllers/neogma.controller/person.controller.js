import Person from "../../models/ne04j-models/person.model.js";

export const getPerson = async (req, res) => {
  const { personId } = req.query;

  try {
    if (!personId || typeof personId !== "string") {
      return res.status(400).json({ message: "Valid Person Id is required" });
    }

    const person = await Person.findOne({ where: { id: personId } });

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    return res.status(200).json({
      message: "Person fetched successfully",
      data: person,
    });
  } catch (error) {
    console.log("Error in fetching the person data", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const viewPerson = async (req, res) => {
  const { userId } = req.query;
  try {
    if (!userId) {
      return res.status(400).json({
        message: "Person id is required",
      });
    }
    if (typeOf(userId) !== "string") {
      return res.status(400).json({
        message: "Invalid Person ID",
      });
    }
  } catch (error) {

  }
};
