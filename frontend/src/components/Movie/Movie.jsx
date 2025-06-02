import axios from 'axios';
import './Movie.css';

function Movie({ prop }) {
  //const deleteUser = (userId) => {
  //  axios
  //    .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
  //    .then(() => onSuccessfulUserDeletion());
  //};

  return (
    <div class="container">
      <table className="Movie-table">
        <thead>
          <tr>
            <th>TITLE</th>
            <th>RELEASE DATE</th>
            <th>POSTER</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{prop.title}</td>
            <td>{prop.release_date}</td>
            <td>
              <img
                src={`https://image.tmdb.org/t/p/w500${prop.poster_path}`}
                alt="POSTER"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Movie;
