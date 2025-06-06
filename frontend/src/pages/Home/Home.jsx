import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import Movie from '../../components/Movie/Movie';
import { api } from '../../api';

function RecommendedBanner({ movies }) {
  const navigate = useNavigate();
  const visibleMovies = movies.slice(0, 10); // max 10 films
  const repeated = [...visibleMovies, ...visibleMovies];

  function handleClick(movie) {
    // Modifie ici pour correspondre à ta route de détail
    navigate(`/movie/${encodeURIComponent(movie.title)}`, {
      state: { Detailprop: movie },
    });
  }

  return (
    <div className="recommended-banner">
      <h3>Recommended for you</h3>
      <div className="scroll-wrapper">
        <div className="scroll-track">
          {repeated.map((movie, index) => (
            <div
              key={`${movie.id}-${index}`}
              className="recommended-movie"
              onClick={() => handleClick(movie)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClick(movie);
                }
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                title={movie.title}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_FORM_VALUES = {
  searchMovie: '',
};

function Home() {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const listmovies = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(formValues.searchMovie.toLowerCase())
    )
    .map((movie) => <Movie prop={movie} />);
  const isEmptyMovies = listmovies.length === 0;

  function useFetchRecmovies() {
    useEffect(() => {
      const options = {
        method: 'GET',
        url: 'http://127.0.0.1:5000/recommendations/1?sort_by=tmdb_avg',
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
          setRecommendedMovies(res.data.result);
        })
        .catch((err) => console.error(err));
    }, []);
  }

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
  useFetchRecmovies();

  return (
    <div className="App">
      <RecommendedBanner movies={recommendedMovies} />
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
