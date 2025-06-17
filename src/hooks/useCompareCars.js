// hooks/useCompareCars.js
import { useEffect, useState } from "react";
import supabase from "@/supabase/supabaseClient";

const useCompareCars = (selectedTable) => {
  const [allCars, setAllCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    expandedBrand: null,
  });

  useEffect(() => {
    if (!selectedTable) return;

    const fetchAllCars = async () => {
      try {
        const { data, error } = await supabase.from(selectedTable).select("*");
        if (error) throw error;
        setAllCars(data);
        const uniqueBrands = [...new Set(data.map((car) => car.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setAllCars([]);
      }
    };

    fetchAllCars();
  }, [selectedTable]);

  useEffect(() => {
    const filtered = filters.expandedBrand
      ? allCars.filter((car) => car.brand === filters.expandedBrand)
      : allCars;
    setAvailableCars(filtered);
  }, [filters.expandedBrand, allCars]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "search") {
      const query = value.toLowerCase();
      if (!query) return setSuggestions([]);
      const matched = allCars
        .filter((car) =>
          `${car.brand} ${car.model} ${car.variant}`.toLowerCase().includes(query)
        )
        .map((car) => ({
          id: car.id,
          name: `${car.brand} ${car.model} ${car.variant}`,
        }));
      setSuggestions(matched);
    }
  };

  const toggleAccordion = (brand) => {
    setFilters((prev) => ({
      ...prev,
      expandedBrand: prev.expandedBrand === brand ? null : brand,
    }));
  };

  return {
    allCars,
    brands,
    availableCars,
    filters,
    suggestions,
    setFilters,
    setSuggestions,
    handleFilterChange,
    toggleAccordion,
  };
};

export default useCompareCars;
