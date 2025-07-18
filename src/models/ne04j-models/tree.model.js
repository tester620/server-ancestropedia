import { ModelFactory } from "neogma";
import { neogma } from "../../config/neo4j.js";
import { Person } from "./person.model.js";

export const FamilyTree = ModelFactory(
  {
    label: "FamilyTree",
    schema: {
      id: { type: "string", required: true },
      ownerId: { type: "string", required: true },
      createdAt: { type: "string", required: true },
      name: { type: "string", required: true },
    },
    primaryKeyField: "id",
    relationships: {
      members: {
        model: () => Person,
        direction: "out",
        name: "HAS_MEMBER",
        properties: {},
        eager: false,
      },
    },
  },
  neogma
);
