import { ModelFactory } from 'neogma';
import { neogma } from '../../config/neo4j.js';

export const Relationship = ModelFactory(
  {
    label: 'Relationship',
    schema: {
      fromId: {
        type: 'string',
        required: true,
      },
      toId: {
        type: 'string',
        required: true,
      },
      relation: {
        type: 'string',
        required: true,
        enum: ['father', 'mother', 'child', 'spouse'],
      },
    },
    primaryKeyField: 'fromId',
  },
  neogma
);