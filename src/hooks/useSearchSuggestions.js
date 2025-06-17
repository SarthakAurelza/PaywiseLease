// components/CompareButton/useSearchSuggestions.js
import { useEffect, useState } from "react";

const useSearchSuggestions = (allCars, search) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const searchValue = search.toLowerCase();
    if (!searchValue) return setSuggestions([]);

    const matches = allCars
      .filter((car) =>
        `${car.brand} ${car.model} ${car.variant}`.toLowerCase().includes(searchValue)
      )
      .map((car) => ({
        id: car.id,
        name: `${car.brand} ${car.model} ${car.variant}`,
      }));

    setSuggestions(matches);
  }, [search, allCars]);

  return suggestions;
};

export default useSearchSuggestions;
