import express from 'express';
import appDataSource from '../datasource.js';
import Genre from '../entities/genre.js';

const router = express.Router();
const genreRepository = appDataSource.getRepository(Genre);

//Get all genres
router.get('/', function (req, res) {
  genreRepository
    .find({})
    .then(function (genreList) {
      res.json({ genre: genreList });
      console.log(genreList);
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching the Movie' });
    });
});

router.get('/:genreId', function (req, res) {
  genreRepository
    .findOneBy({ id: req.params.genreId })
    .then(function (genrefound) {
      console.log(req.params.movieId);
      console.log(genrefound);
      if (!genrefound) {
        res.status(404).json({ message: 'Genre not found' });
      }
      res.status(200).json(genrefound);
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching genre' });
    });
});

export default router;
