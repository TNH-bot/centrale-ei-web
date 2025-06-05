import typeorm from 'typeorm';
export const Grade = new typeorm.EntitySchema({
  name: 'Grade',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    grade: {
      type: 'float',
    },
  },
  relations: {
    movie: {
      type: 'many-to-one',
      target: 'Movie',
      joinColumn: true,
      nullable: false,
    },
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
  },
});

export default Grade;
