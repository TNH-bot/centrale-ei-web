import typeorm from 'typeorm';
const Actor = new typeorm.EntitySchema({
  name: 'Actor',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    name: {
      type: String,
      unique: true,
    },
  },
  relations: {
    cast: {
      type: 'many-to-many',
      target: 'Movie',
      inverseSide: 'starring',
      eager: true,
    },
  },
});

export default Actor;
