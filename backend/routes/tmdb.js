import express from 'express';
import axios from 'axios';
import appDataSource from '../datasource.js';
import Movie from '../entities/movie.js';
import Actor from '../entities/actor.js';
//import { setMovies } from '../services/moviesService.js';

const router = express.Router();

router.post('/', function (req, res) {
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

  const movieRepository = appDataSource.getRepository(Movie);
  movieRepository.deleteAll();

  const actorRepository = appDataSource.getRepository(Actor);
  actorRepository.deleteAll();

  axios
    .request(options)
    .then(async (axiosres) => {
      //console.log(axiosres.data.results);
      console.log('Trending movies fetched from TMDB');

      for (const movie of axiosres.data.results) {
        const cast = await axios
          .request({
            method: 'GET',
            url: `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            params: { language: 'en-US', page: '1' },
            headers: {
              accept: 'application/json',
              Authorization:
                'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
            },
          })
          .then((castres) => {
            return castres.data.cast;
          });

        const movieCast = await Promise.all(
          cast.map(async (actor) => {
            const existingActor = await actorRepository.findOneBy({
              id: actor.name,
            });

            return (
              existingActor ??
              actorRepository.create({ id: actor.id, name: actor.name })
            );
          })
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
              });

              await movieRepository.save(newMovie);
            }
          });
      }
      res.json({
        message: 'Trending movies fetched',
        results: axiosres.data.results,
      });
    })
    .catch((err) => console.error(err));
});

router.post('/:movieId', function (req, res) {
  const options = {
    method: 'GET',
    url: 'https://api.themoviedb.org/3/movie/' + req.params.movieId,
    params: { language: 'en-US', page: '1' },
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
    },
  };

  axios
    .request(options)
    .then((axiosres) => {
      console.log('Trending movies fetched from TMDB');
      const movieRepository = appDataSource.getRepository(Movie);
      console.log(req.body);
      const newMovie = movieRepository.create({
        title: axiosres.data.title,
        release_date: axiosres.data.release_date,
        poster_path: axiosres.data.poster_path,
        tmdb_average: axiosres.data.vote_average,
        overview: axiosres.data.overview,
        starring: axiosres.data.credits.cast,
        genre: axiosres.data.genres,
      });
      movieRepository
        .insert(newMovie)
        .then(function (savedMovie) {
          res.status(201).json({
            message: 'Movie successfully created',
            id: savedMovie.id,
          });
        })
        .catch(function (error) {
          console.error(error);
          if (error.code === '23505') {
            res.status(400).json({
              message: `Movie with title "${newMovie.title}" already exists`,
            });
          } else {
            res.status(500).json({ message: 'Error while creating the movie' });
          }
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: 'Error while fetching the movie',
      });
    });
});

export default router;
