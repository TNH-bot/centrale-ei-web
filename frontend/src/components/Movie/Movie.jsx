//import axios from 'axios';
import './Movie.css';

function Movie({ prop }) {
  //const deleteUser = (userId) => {
  //  axios
  //    .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
  //    .then(() => onSuccessfulUserDeletion());
  //};

  return (
    <div class="Movie">
      <h3 className="Movie-title">{prop.title}</h3>
      <img
        className="Movie-poster"
        src={`https://image.tmdb.org/t/p/w200${prop.poster_path}`}
        alt="POSTER"
      />
      <p className="Movie-release-date">Release: {prop.release_date}</p>
    </div>
  );
}

export default Movie;
