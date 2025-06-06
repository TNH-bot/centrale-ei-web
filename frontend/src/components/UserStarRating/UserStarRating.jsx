import React, { useState } from 'react';
import axios from 'axios';

function UserStarRating({ maxRating = 10, onRate }) {
  // note entre 0 et maxRating (ici maxRating = 10)
  const [rating, setRating] = useState(0);

  // convertit note sur 10 en note sur 5 étoiles
  const starsRating = rating / 2;

  // gestion du clic sur étoile i (1 à 5)
  const handleClick = (starIndex) => {
    const newRating = starIndex * 2; // 1 étoile = 2 points
    setRating(newRating);
    if (onRate) {
      onRate(newRating);
    } // callback optionnel

    console.log(`Rating set to: ${newRating}`);
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
