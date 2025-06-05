import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
      unique: true,
    },
    release_date: { type: String },
    poster_path: { type: String },
    tmdb_average: {
      type: 'float',
      nullable: true,
    },
    overview: {
      type: 'float',
      nullable: true,
    },
  },
  relations: {
    genre: {
      type: 'many-to-many',
      target: 'Genre',
      joinTable: true,
      cascade: true,
      inverseSide: 'movie',
    },
    starring: {
      type: 'many-to-many',
      target: 'Actor',
      joinTable: true,
      cascade: true,
      inverseSide: 'cast',
    },
    grades: {
      type: 'one-to-many',
      target: 'Grade',
      inverseSide: 'movie',
      cascade: true,
    },
  },
});

export default Movie;
