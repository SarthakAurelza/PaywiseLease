import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function useAllModels(selectedBrand = null) {
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = useSelector((state) => state.filters);
  const payloadBrand = selectedBrand || filters.brand

  useEffect(() => {
    const fetchModels = async () => {
      if (!payloadBrand) return;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/models`,
          { make: payloadBrand }
        );
        setAllModels(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch models:", err);
        setAllModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [payloadBrand]);

  return { allModels, loading };
}
