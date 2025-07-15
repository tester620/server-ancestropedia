// Define Person model
class Person extends Model {}
Person.init({
  label: 'Person',
  schema: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    birthYear: { type: 'number' },
    deathYear: { type: 'number' },
    gender: { type: 'string', enum: ['M', 'F', 'X'] }
  },
  primaryKeyField: 'id',
  neogma
});

// Define relationships
Person.addRelationship('parents', {
  model: Person,
  name: 'CHILD_OF',
  direction: 'out'
});

Person.addRelationship('spouses', {
  model: Person,
  name: 'MARRIED_TO',
  direction: 'undirected'
});

Person.addRelationship('children', {
  model: Person,
  name: 'CHILD_OF',
  direction: 'in' // Reverse of parents
});