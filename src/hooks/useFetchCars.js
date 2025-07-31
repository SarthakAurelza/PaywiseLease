import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PAGE_SIZE = 4;
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function useFetchCars() {
  const filters = useSelector((state) => state.filters);
  const { brand, model, variant, powerPlant, selectedVehicle } = filters;

  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔧 Generate search query by plain concatenation
  const query = useMemo(() => {
    if (selectedVehicle) {
      console.log("query is: ",`${selectedVehicle.brand || ''} ${selectedVehicle.model || ''} ${selectedVehicle.variant || ''}`.trim())
      return `${selectedVehicle.brand || ''} ${selectedVehicle.model || ''} ${selectedVehicle.variant || ''}`.trim();
    }
    if (brand && model && variant) return `${brand} ${model} ${variant}`;
    if (brand && model) return `${brand} ${model}`;
    if (brand) return brand;
    return 'all';
  }, [brand, model, variant, selectedVehicle]);

  // 📡 Fetch from /api/asearch?q=...
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        console.log("query: ",query);
        const res = await axios.get(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
        setAllVehicles(res.data?.hits || []);
       
      } catch (err) {
        console.error('[useFetchCars] Fetch error:', err);
        setError('Failed to fetch cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [query]);

  // 🧠 Apply powerPlant filter locally
  const filteredVehicles = useMemo(() => {
    let result = allVehicles;
    if (powerPlant) {
      result = result.filter((car) =>
        Array.isArray(powerPlant)
          ? powerPlant.includes(car.powerPlant)
          : car.powerPlant === powerPlant
      );
    }
    setCurrentPage(1)
    return result;
  }, [allVehicles, powerPlant]);

  // 🎯 If search or all 3 filters are filled → show one exact match
  const exactOneMatch = selectedVehicle || (brand && model && variant);

  // 📦 Paginate cars
  const cars = useMemo(() => {
    
    // const validCars = filteredVehicles.filter(car => car.leasePrices?.weekly);
    const ultraValid = filteredVehicles.filter(car => {
  const matchBrand = brand ? car.brand?.toLowerCase() === brand.toLowerCase() : true;
  const matchModel = model ? car.model?.toLowerCase() === model.toLowerCase() : true;
  const matchVariant = variant ? car.variant?.toLowerCase() === variant.toLowerCase() : true;
  return matchBrand && matchModel && matchVariant;
});

console.log("ultra valid", ultraValid);

    const paginated = exactOneMatch
      ? ultraValid.slice(0, 1)
      : ultraValid.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    setTotalPages(Math.ceil(ultraValid.length / PAGE_SIZE));
    return paginated;
  }, [filteredVehicles, currentPage, exactOneMatch]);

  return {
    cars,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalPages,
    allVehicles,
  };
}
