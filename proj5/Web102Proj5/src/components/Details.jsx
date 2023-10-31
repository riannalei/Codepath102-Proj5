// Detail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CLIENT_ID = "XoSmE66nWiv8QdGAjPmgaYgzH0paqc43vXG6bSOYwl4x1gDyoj";
const CLIENT_SECRET = "7udirf6TDuIsCdYczhcHNtxBsNT6L1VDnUKqL1go";

function Detail() {
  const { animalId } = useParams();
  const [animalDetails, setAnimalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnimalDetails(id) {
      try {
        const tokenResponse = await fetch(
          "https://api.petfinder.com/v2/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          }
        );

        const { access_token } = await tokenResponse.json();

        const response = await fetch(
          `https://api.petfinder.com/v2/animals/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );

        const data = await response.json();
        setAnimalDetails(data.animal);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAnimalDetails(animalId);
  }, [animalId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {animalDetails && (
        <div>
          <h1>{animalDetails.name}</h1>
          <img
            src={animalDetails.photos[0]?.medium || ""}
            alt={animalDetails.name}
          />
          <p>{animalDetails.description}</p>
          {/* ...other details */}
        </div>
      )}
    </div>
  );
}

export default Detail;
