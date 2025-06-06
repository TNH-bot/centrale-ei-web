import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function UserStarRating({ maxRating = 10, movie_id, onRate }) {
  // note entre 0 et maxRating (ici maxRating = 10)

  useEffect(() => {
    axios
      .get(`http://localhost:8000/grades?user_id=1&movie_id=${movie_id}`)
      .then((response) => {
        if (response.data && response.data.grade) {
          setRating(response.data.grade);
        }
      })
      .catch((error) => {
        // handle error if needed
      });
  }, [movie_id]);

  const [rating, setRating] = useState(0); // note initiale

  // convertit note sur 10 en note sur 5 étoiles
  const starsRating = rating / 2;

  // gestion du clic sur étoile i (1 à 5)
  const handleClick = (starIndex) => {
    const newRating = starIndex * 2; // 1 étoile = 2 points
    setRating(newRating);
    if (onRate) {
      onRate(newRating);
    } // callback optionnel

    axios({
      method: 'post',
      url: 'http://localhost:8000/grades', // Remplacez par l'URL de votre API
      headers: {},
      data: {
        user_id: 1,
        movie_id: movie_id,
        grade: newRating, // This is the body part
      },
    });
  };

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let starIcon;
    if (starsRating >= i) {
      starIcon = '★';
    } // pleine
    else if (starsRating >= i - 0.5) {
      starIcon = '⯨';
    } // semi-pleine (ou autre symbole)
    else {
      starIcon = '☆';
    } // vide

    stars.push(
      <span
        key={i}
        style={{
          cursor: 'pointer',
          fontSize: '30px',
          color: '#f5c518',
          marginRight: 5,
        }}
        onClick={() => handleClick(i)}
        role="button"
        aria-label={`${i * 2} points`}
      >
        {starIcon}
      </span>
    );
  }

  return (
    <div>
      <div>{stars}</div>
      <p>
        Your rating: {rating} / {maxRating}
      </p>
    </div>
  );
}
export default UserStarRating;
