import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import supabase from '@/supabase/supabaseClient';
import { setAllCarsForTable } from '@/features/filtersSlice';

const usefetchAllCars = () => {
  const dispatch = useDispatch();
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const allCarsByTable = useSelector((state) => state.filters.allCarsByTable);
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSelectedTable = () => {
    if (!selectedOption) return null;
    return selectedOption === 'know' ? 'test_data_dump2' : 'Car_Details';
  };

  const fetchCars = async () => {
    const table = getSelectedTable();
    if (!table) return;

    // Use cache if available
    if (allCarsByTable[table]) {
      const cachedCars = allCarsByTable[table];
      setCars(cachedCars);
      setBrands([...new Set(cachedCars.map((car) => car.brand))]);
      setModels([...new Set(cachedCars.map((car) => car.model))]);
      setVariants([...new Set(cachedCars.map((car) => car.variant))]);
      return;
    }

    // Otherwise fetch from Supabase
    setLoading(true);
    setError(null);

    try {
      const chunkSize = 1000;
      let allCars = [];
      let from = 0;
      let to = chunkSize - 1;
      let keepFetching = true;

      while (keepFetching) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .range(from, to);

        if (error) throw error;

        allCars = allCars.concat(data);

        if (data.length < chunkSize) {
          keepFetching = false;
        } else {
          from += chunkSize;
          to += chunkSize;
        }
      }

      setCars(allCars);
      dispatch(setAllCarsForTable({ table, cars: allCars }));

      const uniqueBrands = [...new Set(allCars.map((car) => car.brand))];
      setBrands(uniqueBrands);
      const uniqueModels = [...new Set(allCars.map((car) => car.model))];
      setModels(uniqueModels);
      const uniqueVariants = [...new Set(allCars.map((car) => car.variant))];
      setVariants(uniqueVariants);
    } catch (err) {
      console.error('Error fetching cars:', err.message);
      setError(err.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchCars();
    }
  }, [selectedOption]);

  return {
    cars,
    brands,
    models,
    variants,
    loading,
    error,
    refresh: fetchCars,
  };
};

export default usefetchAllCars;
