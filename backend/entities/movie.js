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
  },
});


export default Movie;
