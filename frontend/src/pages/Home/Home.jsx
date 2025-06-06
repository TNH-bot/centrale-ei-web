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

  function useFetchmovies() {
    useEffect(() => {
      const options = {
        method: 'GET',
        url: 'http://localhost:8000/movies',
        params: { language: 'en-US', page: '1' },
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
        },
      };

      axios
        .request(options)
        .then((res) => {
          console.log(res.data);
          setMovies(res.data.movies);
        })
        .catch((err) => console.error(err));
    }, []);
  }
  // ...

  useFetchmovies();

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
