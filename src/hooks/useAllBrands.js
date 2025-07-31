import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function useAllBrands() {
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/makes`);
        setAllBrands(res.data);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setAllBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { allBrands, loading };
}
