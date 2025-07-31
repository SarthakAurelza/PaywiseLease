import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import useFetchCars from './useFetchCars';

export default function useVehicleOptions() {
  const filters = useSelector((state) => state.filters);
  const { brand, model } = filters;
  const { allVehicles, loading } = useFetchCars();

  const brands = useMemo(() => {
    return [...new Set(allVehicles.map(v => v.brand).filter(Boolean))];
  }, [allVehicles]);

  const models = useMemo(() => {
    if (!brand) return [];
    return [...new Set(allVehicles
      .filter(v => v.brand?.toLowerCase() === brand.toLowerCase())
      .map(v => v.model)
    )];
  }, [allVehicles, brand]);

  const variants = useMemo(() => {
    if (!brand || !model) return [];
    return [...new Set(allVehicles
      .filter(v =>
        v.brand?.toLowerCase() === brand.toLowerCase() &&
        v.model?.toLowerCase() === model.toLowerCase()
      )
      .map(v => v.variant)
    )];
  }, [allVehicles, brand, model]);

  return {
    brands,
    models,
    variants,
    loading,
  };
}
