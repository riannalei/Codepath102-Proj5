import React, { useEffect, useState, useMemo } from "react";
import Card from "./Card";

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

  const totalAnimals = filteredAnimals.length;
  const youngAnimalsCount = filteredAnimals.filter(
    (animal) => animal.age === "young"
  ).length;
  const maleAnimalsCount = filteredAnimals.filter(
    (animal) => animal.gender === "Male"
  ).length;
  const femaleAnimalsCount = filteredAnimals.filter(
    (animal) => animal.gender === "Female"
  ).length;
  const uniqueBreeds = new Set(
    filteredAnimals.map((animal) => animal.breeds.primary)
  ).size;

  const availableBreeds = Array.from(
    new Set(animals.map((animal) => animal.breeds.primary))
  );

  return (
    <div>
      {/* Summary statistics */}
      <div>
        <p>Total animals: {totalAnimals}</p>
        <p>Number of young animals: {youngAnimalsCount}</p>
        <p>Number of male animals: {maleAnimalsCount}</p>
        <p>Number of female animals: {femaleAnimalsCount}</p>
        <p>Unique breeds: {uniqueBreeds}</p>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        {/* ... other types ... */}
      </select>

      <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
        <option value="">All Ages</option>
        <option value="young">Young</option>
        <option value="adult">Adult</option>
        {/* ... other ages ... */}
      </select>

      <select
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
      >
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        value={breedFilter}
        onChange={(e) => setBreedFilter(e.target.value)}
      >
        <option value="">All Breeds</option>
        {availableBreeds.map((breed) => (
          <option value={breed.toLowerCase()} key={breed}>
            {breed}
          </option>
        ))}
      </select>

      {/* Animal list */}
      {filteredAnimals.map((animal) => (
        <Card key={animal.id} animal={animal} />
      ))}
    </div>
  );
}

export default List;
