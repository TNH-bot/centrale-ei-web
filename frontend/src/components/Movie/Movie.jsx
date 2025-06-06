//import axios from 'axios';
import './Movie.css';
import { Link } from 'react-router-dom';

function Movie({ prop }) {
  return (
    <Link
      to={`/Movie/${encodeURIComponent(prop.title)}`}
      state={{ Detailprop: prop }}
      className="Movie"
    >
      <h3 className="Movie-title">{prop.title}</h3>
      <img
        className="Movie-poster"
        src={`https://image.tmdb.org/t/p/w200${prop.poster_path}`}
        alt="POSTER"
      />
      <p className="Movie-release-date">Release: {prop.release_date}</p>
    </Link>
  );
}

export default Movie;

{
  /* <div class="Movie">
<h3 className="Movie-title">{prop.title}</h3>
<img
  className="Movie-poster"
  src={`https://image.tmdb.org/t/p/w200${prop.poster_path}`}
  alt="POSTER"
/>
<p className="Movie-release-date">Release: {prop.release_date}</p>
</div> */
}
