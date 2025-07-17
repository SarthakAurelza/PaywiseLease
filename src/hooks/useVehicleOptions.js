// hooks/useVehicleOptions.js

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBrands, getModels } from "@/api/api";

export default function useVehicleOptions() {
  const filters = useSelector((state) => state.filters);
  const [brands, setBrands] = useState([]);
  const [modelsMap, setModelsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        const fetchedBrands = await getBrands();
        setBrands(fetchedBrands);

        const brandModelMap = {};
        await Promise.all(
          fetchedBrands.map(async (brand) => {
            try {
              const models = await getModels({ make: brand });
              brandModelMap[brand] = models;
            } catch {
              brandModelMap[brand] = [];
            }
          })
        );
        setModelsMap(brandModelMap);
      } catch (e) {
        console.error("Failed to load vehicle options", e);
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const models = filters.brand ? modelsMap[filters.brand] || [] : [];

  const variants = filters.brand && filters.model
    ? modelsMap[filters.brand]?.filter((m) => m === filters.model) ?? []
    : [];

  return { brands, models, variants, loading };
}
