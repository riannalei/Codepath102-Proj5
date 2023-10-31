// List.jsx
import React, { useEffect, useState, useMemo } from "react";
import Card from "./Card";
import DataVisualization from "./DataVisualization"; // Ensure this component is created
import { useNavigate } from "react-router-dom"; // Import for programmatic navigation

const CLIENT_ID = "XoSmE66nWiv8QdGAjPmgaYgzH0paqc43vXG6bSOYwl4x1gDyoj";
const CLIENT_SECRET = "7udirf6TDuIsCdYczhcHNtxBsNT6L1VDnUKqL1go";

async function fetchAccessToken() {
  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchAnimals(token) {
  const response = await fetch(
    "https://api.petfinder.com/v2/animals?type=dog&page=2",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  return data.animals;
}

function List() {
  const [animals, setAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const fetchedToken = await fetchAccessToken();
      const fetchedAnimals = await fetchAnimals(fetchedToken);
      setAnimals(fetchedAnimals);
    }

    fetchData();
  }, []);

  const filteredAnimals = useMemo(() => {
    return animals
      .filter(
        (animal) =>
          !searchTerm ||
          animal.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (animal) => !typeFilter || animal.type.toLowerCase() === typeFilter
      )
      .filter((animal) => !ageFilter || animal.age.toLowerCase() === ageFilter)
      .filter(
        (animal) =>
          !genderFilter || animal.gender.toLowerCase() === genderFilter
      )
      .filter(
        (animal) =>
          !breedFilter || animal.breeds.primary.toLowerCase() === breedFilter
      );
  }, [animals, searchTerm, typeFilter, ageFilter, genderFilter, breedFilter]);

  const visualizationData = useMemo(() => {
    const genderData = animals.reduce((acc, animal) => {
      const gender = animal.gender || "Unknown";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(genderData).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [animals]);

  // Handlers for dropdown changes
  const handleTypeFilterChange = (e) => setTypeFilter(e.target.value);
  const handleAgeFilterChange = (e) => setAgeFilter(e.target.value);
  const handleGenderFilterChange = (e) => setGenderFilter(e.target.value);
  const handleBreedFilterChange = (e) => setBreedFilter(e.target.value);

  // Function to navigate to the Detail view of an animal
  const handleCardClick = (animalId) => {
    navigate(`/animal/${animalId}`);
  };

  return (
    <div>
      <DataVisualization data={visualizationData} />

      <div>
        <p>Total animals: {filteredAnimals.length}</p>
        {/* ...other summary statistics */}
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select value={typeFilter} onChange={handleTypeFilterChange}>
        <option value="">All Types</option>
        {Array.from(new Set(animals.map((animal) => animal.type))).map(
          (type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          )
        )}
      </select>

      <select value={ageFilter} onChange={handleAgeFilterChange}>
        <option value="">All Ages</option>
        {Array.from(new Set(animals.map((animal) => animal.age))).map(
          (age, index) => (
            <option key={index} value={age}>
              {age}
            </option>
          )
        )}
      </select>

      <select value={genderFilter} onChange={handleGenderFilterChange}>
        <option value="">All Genders</option>
        {Array.from(new Set(animals.map((animal) => animal.gender))).map(
          (gender, index) => (
            <option key={index} value={gender}>
              {gender}
            </option>
          )
        )}
      </select>

      <select value={breedFilter} onChange={handleBreedFilterChange}>
        <option value="">All Breeds</option>
        {Array.from(
          new Set(animals.map((animal) => animal.breeds.primary))
        ).map((breed, index) => (
          <option key={index} value={breed}>
            {breed}
          </option>
        ))}
      </select>

      {filteredAnimals.map((animal) => (
        <div key={animal.id} onClick={() => handleCardClick(animal.id)}>
          <Card animal={animal} />
        </div>
      ))}
    </div>
  );
}

export default List;
