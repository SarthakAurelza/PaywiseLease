// hooks/useFilteredCars.ts
import { useMemo } from 'react';

const useFilteredCars = (cars, filters, sortCriteria, sortOrder) => {
  return useMemo(() => {
    let filtered = [...cars];

    if (filters.engine) {
      filtered = filtered.filter((car) =>
        Array.isArray(filters.engine)
          ? filters.engine.includes(car.engine)
          : car.engine === filters.engine
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((car) =>
        car.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.model) {
      filtered = filtered.filter((car) =>
        car.model.toLowerCase().includes(filters.model.toLowerCase())
      );
    }

    if (filters.body) {
      filtered = filtered.filter((car) => car.body === filters.body);
    }

    if (filters.seats > 0) {
      filtered = filtered.filter((car) => car.seats === filters.seats);
    }

    if (filters.price?.min !== undefined && filters.price?.max !== undefined) {
      filtered = filtered.filter(
        (car) => car.price >= filters.price.min && car.price <= filters.price.max
      );
    }

    if (filters.fuel_consumption) {
      filtered = filtered.filter((car) =>
        car.fuel_consumption.toLowerCase().includes(filters.fuel_consumption.toLowerCase())
      );
    }

    if (sortCriteria === 'price') {
      filtered.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
    } else if (sortCriteria === 'fuel_consumption') {
      filtered.sort((a, b) => {
        const fuelA = parseFloat(a.fuel_consumption.replace(/[^\d.]/g, '')) || 0;
        const fuelB = parseFloat(b.fuel_consumption.replace(/[^\d.]/g, '')) || 0;
        return sortOrder === 'asc' ? fuelA - fuelB : fuelB - fuelA;
      });
    }

    return filtered;
  }, [cars, filters, sortCriteria, sortOrder]);
};

export default useFilteredCars;
