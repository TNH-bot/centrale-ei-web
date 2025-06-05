// import './AddMovie.css';
// import { useEffect, useState } from 'react';
// import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
// import { useAddMovies } from './useAddMovie';

// const DEFAULT_FORM_VALUES = {
//   searchMovie: '',
// };

// function AddMovie() {
//   const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);

//   const { newMovies, moviesLoadingError, addMovies } = useAddMovies();

//   return (
//     <div className="Movies-container">
//       <h1>This page displays the movies</h1>
//       <AddMovieForm onSuccessfulMovieCreation={addMovies} />
//       {moviesLoadingError !== null && (
//         <div className="movies-loading-error">{moviesLoadingError}</div>
//       )}
//       <input
//         placeholder="Speed"
//         value={formValues.searchMovie}
//         onChange={(event) =>
//           setFormValues({ ...formValues, searchMovie: event.target.value })
//         }
//       />
//       <p>Retour : {formValues.searchMovie}</p>
//     </div>
//   );
// }

// export default AddMovie;

import React, { useState } from 'react';
import './AddMovie.css';

const AddMovie = () => {
  const [movie, setMovie] = useState({
    title: '',
    releaseDate: '',
    posterUrl: '',
    averageRating: '',
    synopsis: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Movie added:', movie);
    // Future: send data to the backend
  };

  return (
    <div className="add-movie-container">
      <form onSubmit={handleSubmit} className="add-movie-form">
        <h2 className="add-movie-title">Add a New Movie</h2>

        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={movie.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            id="releaseDate"
            value={movie.releaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="posterUrl">Poster URL</label>
          <input
            type="url"
            name="posterUrl"
            id="posterUrl"
            value={movie.posterUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="averageRating">Average Rating</label>
          <select
            name="averageRating"
            id="averageRating"
            value={movie.averageRating}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a rating --</option>
            <option value="0">0</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="synopsis">Synopsis</label>
          <textarea
            name="synopsis"
            id="synopsis"
            value={movie.synopsis}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Movie
        </button>
      </form>
    </div>
  );
};

export default AddMovie;
