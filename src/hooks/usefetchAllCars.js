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

  const tables = {
    know: 'test_data_dump2',
    browse: 'Car_Details',
  };

  const getSelectedTable = () => {
    if (!selectedOption) return null;
    return tables[selectedOption];
  };

  const processCars = (cars) => {
    setCars(cars);
    setBrands([...new Set(cars.map((car) => car.brand))]);
    setModels([...new Set(cars.map((car) => car.model))]);
    setVariants([...new Set(cars.map((car) => car.variant))]);
  };

  const fetchCarsFromTable = async (table) => {
    const chunkSize = 1000;
    let allCars = [];
    let from = 0;
    let to = chunkSize - 1;
    let keepFetching = true;

    while (keepFetching) {
      const { data, error } = await supabase.from(table).select('*').range(from, to);
      if (error) throw error;
      allCars = allCars.concat(data);
      if (data.length < chunkSize) {
        keepFetching = false;
      } else {
        from += chunkSize;
        to += chunkSize;
      }
    }

    return allCars;
  };

  const fetchAllTables = async () => {
    setLoading(true);
    setError(null);

    try {
      const allFetched = {};

      for (const [key, table] of Object.entries(tables)) {
        if (!allCarsByTable[table]) {
          const cars = await fetchCarsFromTable(table);
          dispatch(setAllCarsForTable({ table, cars }));
          allFetched[table] = cars;
        } else {
          allFetched[table] = allCarsByTable[table];
        }
      }

      const currentTable = getSelectedTable();
      if (currentTable) {
        processCars(allFetched[currentTable]);
      }
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
      fetchAllTables();
    }
  }, [selectedOption]);

  return {
    cars,
    brands,
    models,
    variants,
    loading,
    error,
    refresh: fetchAllTables,
  };
};

export default usefetchAllCars;
