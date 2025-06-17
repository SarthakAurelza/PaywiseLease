import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import supabase from '@/supabase/supabaseClient';

const usefetchAllCars = () => {
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSelectedTable = () => {
    if (!selectedOption) return null;
    return selectedOption === 'know' ? 'test_data_dump2' : 'Car_Details';
  };

  const fetchCars = async () => {
    const table = getSelectedTable();
    if (!table) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;

      setCars(data || []);
      const uniqueBrands = [...new Set((data || []).map(car => car.brand))];
      setBrands(uniqueBrands);
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
    loading,
    error,
    refresh: fetchCars,
  };
};

export default usefetchAllCars;
