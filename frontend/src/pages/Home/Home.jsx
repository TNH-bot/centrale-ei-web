import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Movie from '../../components/Movie/Movie';
import { api } from '../../api';

const DEFAULT_FORM_VALUES = {
  searchMovie: '',
};

function Home() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);
  const listmovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(formValues.searchMovie.toLowerCase())
    )
    .map((movie) => <Movie prop={movie} />);
  const isEmptyMovies = listmovies.length === 0;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Movielist</h1>
        <input
          placeholder="Search..."
          value={formValues.searchMovie}
          onChange={(event) =>
            setFormValues({ ...formValues, searchMovie: event.target.value })
          }
        />
        <p>Retour : {formValues.searchMovie}</p>

        {isEmptyMovies ? (
          <p className="App-intro">No movies found</p>
        ) : (
          <div className="container">{listmovies}</div>
        )}
      </header>
    </div>
  );
}

export default Home;
