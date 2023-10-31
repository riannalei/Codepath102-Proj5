// Card.js
import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Card({ animal }) {
  return (
    <Link
      to={`/animal/${animal.id}`}
      className="card-container"
      style={{ textDecoration: "none" }}
    >
      {" "}
      {/* Wrap with Link */}
      <h2>{animal.name}</h2>
      {animal.photos && animal.photos[0] && animal.photos[0].medium ? (
        <img src={animal.photos[0].medium} alt={animal.name} />
      ) : (
        <p>No image available</p>
      )}
      <p>{animal.description}</p>
      {/* ...any other attributes you wish to display */}
    </Link>
  );
}

export default Card;
