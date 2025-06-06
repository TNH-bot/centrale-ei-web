import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import Movie from '../../components/Movie/Movie';

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
        setMovies(res.data.results);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(formValues.searchMovie.toLowerCase())
  );

  const listmovies = filteredMovies.map((movie) => (
    <Movie key={movie.id} prop={movie} />
  ));

  const isEmptyMovies = listmovies.length === 0;

  return (
    <>
      <RecommendedBanner movies={filteredMovies} />
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
            <div className="container">{listmovies}</div>
          )}
        </header>
      </div>
    </>
  );
}

export default Home;
