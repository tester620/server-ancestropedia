import { ModelFactory } from "neogma";
import { neogma } from "../../config/neo4j.js";

const Person = ModelFactory(
  {
    label: "Person",
    schema: {
      id: { type: "string", required: true },
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      gender: { type: "string" },
      dob: { type: "string" },
      birthplace: { type: "string" },
      profileImage: { type: "string" },
      createdBy: { type: "string", required: true },
      // Removed treeId - relationships should be through graph connections
    },
    primaryKeyField: "id",
    relationships: {
      belongsTo: {
        model: "FamilyTree",
        direction: "out",
        name: "BELONGS_TO",
      },
      parentOf: {
        model: "Person",
        direction: "out",
        name: "PARENT_OF",
      },
      marriedTo: {
        model: "Person",
        direction: "out",
        name: "MARRIED_TO",
      },
      childOf: {
        model: "Person",
        direction: "out",
        name: "CHILD_OF",
      },
    },
  },
  neogma
);

export default Person;