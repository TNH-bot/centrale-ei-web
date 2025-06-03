import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Movie from '../../components/Movie/Movie';

const DEFAULT_FORM_VALUES = {
  searchMovie: '',
};

function Home() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);
  const listmovies = movies
    .filter((movie) => movie.title.includes(formValues.searchMovie))
    .map((movie) => <Movie prop={movie} />);
  const isEmptyMovies = listmovies.length === 0;

  function useFetchmovies() {
    useEffect(() => {
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
        .then((res) => {
          console.log(res.data.results);
          setMovies(res.data.results);
        })
        .catch((err) => console.error(err));
      console.log('HelloWorld');
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
          placeholder="Speed"
          value={formValues.searchMovie}
          onChange={(event) =>
            setFormValues({ ...formValues, searchMovie: event.target.value })
          }
        />
        <p>Retour : {formValues.searchMovie}</p>

        {isEmptyMovies ? (
          <p className="App-intro">No movies found</p>
        ) : (
          <div class="container">{listmovies}</div>
        )}
        {/*<p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        */}
      </header>
    </div>
  );
}

export default Home;
