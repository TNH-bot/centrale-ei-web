import express from 'express';
import appDataSource from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movielist) {
      res.json({ movies: movielist });
      console.log(movielist);
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching the Movie' });
    });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  console.log(req.body);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
    poster_path: req.body.poster_path,
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
});

router.get('/graded/:userId', async function (req, res) {
  try {
    const result = await appDataSource
      .getRepository(Movie)
      .createQueryBuilder('movie')
      .innerJoin('movie.grades', 'grade', 'grade.userId = :userId', {
        userId: 1,
      })
      .select([
        'movie.id',
        'movie.title',
        'movie.poster_path',
        'movie.release_date',
        'grade.grade',
      ])
      .getMany();

    res.json({ movies: result });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Error while fetching graded movies by user' });
  }
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
