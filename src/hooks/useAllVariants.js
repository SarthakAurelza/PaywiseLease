import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function useAllVariants(selectedBrand = null,selectedModel = null) {
  const [allVariants, setAllVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  const { brand, model } = useSelector((state) => state.filters);

  const payloadBrand = selectedBrand || brand;
  const payloadModel = selectedBrand || model;

  useEffect(() => {
    if (!payloadBrand || !payloadModel) return;

    const fetchVariants = async () => {
      setLoading(true);
      try {
        const query = `${payloadBrand} ${payloadModel}`;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        const exactMatches = (res.data.hits || []).filter(
          (car) =>
            car.brand?.toLowerCase() === brand.toLowerCase() &&
            car.model?.toLowerCase() === model.toLowerCase()
        );

        const uniqueVariants = [
          ...new Set(exactMatches.map((car) => car.variant).filter(Boolean)),
        ];

        setAllVariants(uniqueVariants);
      } catch (err) {
        console.error("❌ Failed to fetch variants:", err);
        setAllVariants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVariants();
  }, [payloadBrand, payloadModel]);

  return { allVariants, loading };
}
