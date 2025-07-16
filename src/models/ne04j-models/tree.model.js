import { ModelFactory } from "neogma";
import { neogma } from "../../config/neo4j.js";

// Define relationships separately to avoid circular dependencies
const relationships = {};

export const FamilyTree = ModelFactory(
  {
    label: "FamilyTree",
    schema: {
      id: { type: "string", required: true },
      name: { type: "string" },
      createdBy: { type: "string", required: true },
      createdAt: { type: "string", required: true },
    },
    primaryKeyField: "id",
    relationships: {
      members: {
        model: "Person",
        direction: "in",
        name: "BELONGS_TO",
      },
    },
  },
  neogma
);

export default FamilyTree;