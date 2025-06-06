import express from 'express';
import appDataSource from '../datasource.js';
import Grade from '../entities/grade.js';
import User from '../entities/user.js';
import Movie from '../entities/movie.js';

const router = express.Router();
const gradeRepository = appDataSource.getRepository(Grade);
const userRepository = appDataSource.getRepository(User);
const movieRepository = appDataSource.getRepository(Movie);

//Get single grade by user and movie
router.get('/', function (req, res) {
  console.log(req.body);
  gradeRepository
    .findOneBy({
      user: userRepository.findOneBy({ id: req.body.user_id }),
      movie: movieRepository.findOneBy({ id: req.body.movie_id }),
    })
    .then(function (gradeFound) {
      if (!gradeFound) {
        return res.status(404).json({ message: 'Grade not found' });
      }
      res.status(200).json({ msg: 'grade Found', grade: gradeFound });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).json({ message: 'Error while fetching grade' });
    });
});

router.post('/', async function (req, res) {
  const gradedUser = await userRepository.findOneBy({ id: req.body.user_id });
  const gradedMovie = await movieRepository.findOneBy({
    id: req.body.movie_id,
  });
  const existingGrade = await gradeRepository.findOneBy({
    user: gradedUser,
    movie: gradedMovie,
  });
  if (!User || !Movie) {
    return res.status(404).json({ message: 'User or Movie not found' });
  } else if (existingGrade) {
    existingGrade.grade = req.body.grade;
    gradeRepository.save(existingGrade);
    res
      .status(200)
      .json({ message: 'Grade successfully updated', id: existingGrade.id });
  } else {
    const newGrade = gradeRepository.create({
      grade: req.body.grade,
      user: gradedUser,
      movie: gradedMovie,
    });
    gradeRepository
      .insert(newGrade)
      .then(function (savedGrade) {
        res
          .status(201)
          .json({ message: 'Grade successfully created', id: savedGrade.id });
      })
      .catch(function (error) {
        console.error(error);
        res.status(500).json({ message: 'Error while creating the grade' });
      });
  }
});

export default router;
