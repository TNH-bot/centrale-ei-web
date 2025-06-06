import express from 'express';
import axios from 'axios';
import appDataSource from '../datasource.js';
import Movie from '../entities/movie.js';
import Actor from '../entities/actor.js';
import Genre from '../entities/genre.js';
//import { setMovies } from '../services/moviesService.js';

const router = express.Router();

const movieRepository = appDataSource.getRepository(Movie);
const actorRepository = appDataSource.getRepository(Actor);
const genreRepository = appDataSource.getRepository(Genre);

const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/movie/top_rated',
  params: { language: 'en-US', page: '1' },
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
  },
};

async function getMovies() {
  let allMovies = [];
  for (let page = 1; page <= 4; page++) {
    const pageOptions = {
      ...options,
      params: { ...options.params, page: page.toString() },
    };
    const movies = await axios
      .request(pageOptions)
      .then((axiosres) => axiosres.data.results)
      .catch((err) => {
        console.error(err);

        return [];
      });
    allMovies = allMovies.concat(movies);
  }

  return allMovies;
}

async function getCast(movieId) {
  const cast = await axios
    .request({
      ...options,
      url: `https://api.themoviedb.org/3/movie/${movieId}/credits`,
    })
    .then((castRes) => castRes.data.cast)
    .catch((err) => {
      console.error(err);
    });
  const movieCast = await Promise.all(
    cast.map(async (actor) => {
      const existingActor = await actorRepository.findOneBy({
        name: actor.name,
      });

      return (
        existingActor ??
        actorRepository.create({ id: actor.id, name: actor.name })
      );
    })
  );

  return movieCast;
}

router.post('/', async function (req, res) {
  //Reset the database
  movieRepository.deleteAll();
  actorRepository.deleteAll();

  const movieList = await getMovies(options);

  for (const movie of movieList) {
    const movieCast = await getCast(movie.id);

    const genreList = await Promise.all(
      movie.genre_ids.map(
        async (genreId) => await genreRepository.findOneBy({ id: genreId })
      )
    );

    // Check if the movie already exists before inserting
    await movieRepository
      .findOneBy({ title: movie.title })
      .then(async (existingMovie) => {
        if (!existingMovie) {
          const newMovie = movieRepository.create({
            title: movie.title,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            tmdb_average: movie.vote_average,
            overview: movie.overview,
            starring: movieCast,
            genre: genreList,
          });

          await movieRepository.save(newMovie);
        }
      });
  }
  res
    .status(201)
    .json({ result: `${movieList.length} movies fetched and saved` });
});

router.post('/:movieId', async function (req, res) {
  const postOptions = {
    ...options,
    url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId,
  };

  try {
    const axiosres = await axios.request(postOptions);

    const cast = await getCast(axiosres.data.id);
    const genreList = await Promise.all(
      axiosres.data.genres.map(
        async (genreId) => await genreRepository.findOneBy({ id: genreId })
      )
    );

    const newMovie = movieRepository.create({
      title: axiosres.data.title,
      release_date: axiosres.data.release_date,
      poster_path: axiosres.data.poster_path,
      tmdb_average: axiosres.data.vote_average,
      overview: axiosres.data.overview,
      starring: cast,
      genre: genreList,
    });

    try {
      const savedMovie = await movieRepository.insert(newMovie);
      res.status(201).json({
        message: 'Movie successfully created',
        id: savedMovie.id,
      });
    } catch (error) {
      console.error(error);
      if (await movieRepository.findOneBy({ title: newMovie.title })) {
        res.status(400).json({
          message: `Movie with title "${newMovie.title}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the movie' });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error while fetching the movie',
    });
  }
});

export default router;
