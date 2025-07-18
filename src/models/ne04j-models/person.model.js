import { ModelFactory } from "neogma";
import { neogma } from "../../config/neo4j.js";

export const Person = ModelFactory(
  {
    label: "Person",
    schema: {
      id: { type: "string", required: true },
      firstName: { type: "string", required: true },
      lastName: { type: "string", required: true },
      dob: { type: "string", required: true },
      living: { type: "boolean", required: true },
      dod: { type: "string", optional: true },
      profileImage: { type: "string", optional: true },
      gender: { type: "string", required: true },
      treeId: { type: "string", optional: true },
      createdAt: { type: "string", required: true },
      updatedAt: { type: "string", required: true },
    },
    primaryKeyField: "id",
    relationships: {},
  },
  neogma
);

Person.addRelationships({
  parents: {
    model: Person,
    direction: "in",
    name: "PARENT_OF",
    properties: {},
    eager: false,
  },
  children: {
    model: Person,
    direction: "out",
    name: "PARENT_OF",
    properties: {},
    eager: false,
  },
  spouse: {
    model: Person,
    direction: "both",
    name: "SPOUSE_OF",
    properties: {},
    eager: false,
  },
});
