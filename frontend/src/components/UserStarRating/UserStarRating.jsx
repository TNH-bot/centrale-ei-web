import React, { useState } from 'react';

function UserStarRating({ maxRating = 10, onRate }) {
  const [rating, setRating] = useState(0); // sur 10

  const handleClick = (event, starIndex) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;

    const clickedHalf = clickX < width / 2 ? 0.5 : 1;
    const newRating = (starIndex - 1) * 2 + clickedHalf * 2; // convertit en base 10

    setRating(newRating);
    if (onRate) {
      onRate(newRating);
    }
  };

  const renderStar = (index) => {
    const starValue = (index - 1) * 2;

    let starIcon = '☆'; // vide
    if (rating >= starValue + 2) {
      starIcon = '★';
    } // pleine
    else if (rating >= starValue + 1) {
      starIcon = '⯨';
    } // demi-pleine

    return (
      <span
        key={index}
        style={{
          cursor: 'pointer',
          fontSize: 30,
          color: '#f5c518',
          marginRight: 5,
          display: 'inline-block',
          width: '30px',
          textAlign: 'center',
        }}
        onClick={(e) => handleClick(e, index)}
        role="button"
        tabIndex="0"
        aria-label={`${starValue + 1} sur 10`}
      >
        {starIcon}
      </span>
    );
  };

  return (
    <div>
      <div>{[1, 2, 3, 4, 5].map((i) => renderStar(i))}</div>
      <p>
        Your rating: {rating} / {maxRating}
      </p>
    </div>
  );
}

export default UserStarRating;

// import React, { useState } from 'react';

// function UserStarRating({ maxRating = 10, onRate }) {
//   // note entre 0 et maxRating (ici maxRating = 10)
//   const [rating, setRating] = useState(0);

//   // convertit note sur 10 en note sur 5 étoiles
//   const starsRating = rating / 2;

//   // gestion du clic sur étoile i (1 à 5)
//   const handleClick = (starIndex) => {
//     const newRating = starIndex * 2; // 1 étoile = 2 points
//     setRating(newRating);
//     if (onRate) {
//       onRate(newRating);
//     } // callback optionnel
//   };

//   const stars = [];

//   for (let i = 1; i <= 5; i++) {
//     let starIcon;
//     if (starsRating >= i) {
//       starIcon = '★';
//     } // pleine
//     else if (starsRating >= i - 0.5) {
//       starIcon = '⯨';
//     } // semi-pleine (ou autre symbole)
//     else {
//       starIcon = '☆';
//     } // vide

//     stars.push(
//       <span
//         key={i}
//         style={{
//           cursor: 'pointer',
//           fontSize: '30px',
//           color: '#f5c518',
//           marginRight: 5,
//         }}
//         onClick={() => handleClick(i)}
//         role="button"
//         aria-label={`${i * 2} points`}
//       >
//         {starIcon}
//       </span>
//     );
//   }

//   return (
//     <div>
//       <div>{stars}</div>
//       <p>
//         Your rating: {rating} / {maxRating}
//       </p>
//     </div>
//   );
// }
// export default UserStarRating;
