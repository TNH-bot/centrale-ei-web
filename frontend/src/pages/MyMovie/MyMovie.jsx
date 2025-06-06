import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyMovie.css';

const MyMovies = () => {
  const [ratedMovies, setRatedMovies] = useState([]);

  useEffect(() => {
    const fetchRatedMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/grades');
        setRatedMovies(response.data);
      } catch (error) {
        console.error('Error fetching rated movies:', error);
      }
    };

    fetchRatedMovies();
  }, []);

  return (
    <div className="my-movies-container">
      <h2>My Rated Movies</h2>
      {ratedMovies.length === 0 ? (
        <p>You haven't rated any movies yet.</p>
      ) : (
        <div className="movies-grid">
          {ratedMovies.map((movie) => (
            <div key={movie.movie_id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <h4>{movie.title}</h4>
              <p>Your rating: {movie.user_rating} ★</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMovies;
