import express from 'express';
import axios from 'axios';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';
//import { setMovies } from '../services/moviesService.js';

const router = express.Router();

router.get('/tmdb', function (req, res) {
  var results = [];
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

  axios
    .request(options)
    .then((axiosres) => {
      console.log(axiosres.data.results);
      results = axiosres.data.results;
      //setMovies(axiosres.data.results);
    })
    .catch((err) => console.error(err));
  console.log('HelloWorld');
  res.json({
    message: 'Trending movies fetched',
    results: results,
  });
});

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movielist) {
      res.json({ movies: movielist });
      console.log(movielist);
    });
  //  .catch(function () {
  //    res.status(500).json({ message: 'Error while fetching the Movie' });
  //  });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  console.log(req.body);
  //res
  //  .status(201)
  //  .json({ message: 'Movie successfully created', movie: req.body || '1' });
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
    poster_path: req.body.poster_path,
  });
  movieRepository
    .insert(newMovie)
    //.save(newMovie);
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
});

router.get('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .findOneBy({ id: req.params.movieId })
    .then(function (moviefound) {
      console.log(req.params.movieId);
      console.log(moviefound);
      if (!moviefound) {
        res.status(404).json({ message: 'Movie not found' });
      }
      res.status(200).json(moviefound);
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching movie' });
    });
});

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the Movie' });
    });
});

export default router;
