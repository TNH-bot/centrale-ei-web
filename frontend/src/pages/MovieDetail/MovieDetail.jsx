import { useLocation } from 'react-router-dom';
import UserStarRating from '../../components/UserStarRating/UserStarRating';

function MovieDetail() {
  function StarRating({ rating }) {
    // rating entre 0 et 5, exemple : 3.7

    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('★'); // étoile pleine
      } else if (rating >= i - 0.5) {
        stars.push('⯨'); // étoile semi-pleine (ou autre caractère)
      } else {
        stars.push('☆'); // étoile vide
      }
    }

    return (
      <div style={{ color: '#f5c518', fontSize: '24px' }}>
        {stars.join(' ')}
      </div>
    );
  }

  const location = useLocation();
  const { Detailprop } = location.state || {};

  if (!Detailprop) {
    return <p>Film introuvable.</p>;
  }
  const ratingOutOfFive = Detailprop.vote_average / 2;

  // Tu peux ici faire une requête ou chercher le film dans une liste
  return (
    <div>
      <h3 className="DetailMovie-title">{Detailprop.title}</h3>
      <img
        className="DetailMovie-poster"
        src={`https://image.tmdb.org/t/p/w200${Detailprop.poster_path}`}
        alt="POSTER"
      />
      <p className="DetailMovie-release-date">
        Release: {Detailprop.release_date}
      </p>
      <h4 className="overview">Overview</h4>
      <p className="overview">{Detailprop.overview}</p>

      <div>
        <h4>Rating:</h4>
        <StarRating rating={ratingOutOfFive} />
      </div>
      <h4>Rate this movie:</h4>
      <UserStarRating />
    </div>
  );
}

export default MovieDetail;
