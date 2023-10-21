// Card.js
import React from "react";

function Card({ animal }) {
  return (
    <div className="card-container">
      <h2>{animal.name}</h2>
      {animal.photos && animal.photos[0] && animal.photos[0].medium ? (
        <img src={animal.photos[0].medium} alt={animal.name} />
      ) : (
        <p>No image available</p>
      )}
      <p>{animal.description}</p>
      {/* ... any other attributes you wish to display ... */}
    </div>
  );
}

export default Card;
