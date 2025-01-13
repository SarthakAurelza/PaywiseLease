import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import supabase from '../supabase/supabaseClient';
import CarCard from './CarCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import CalculationSide from './CalculationSide';

const CarList = () => {
  const filters = useSelector((state) => state.filters); // Use only filters from Redux
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const pageSize = 4;

  // Fetch all cars once and cache them
  const fetchAllCars = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('Car_Details').select('*');
      if (error) {
        console.error('Supabase error:', error.message);
        setAllCars([]);
      } else {
        setAllCars(data);
        setFilteredCars(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setAllCars([]);
    }
    setLoading(false);
  };

  // Apply filters on the cached data
  const applyFilters = () => {
    let filtered = [...allCars];

    if (filters.engine && Array.isArray(filters.engine)) {
      filtered = filtered.filter((car) => filters.engine.includes(car.engine));
    } else if (filters.engine) {
      filtered = filtered.filter((car) => car.engine === filters.engine);
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

    setFilteredCars(filtered);
  };

  // Fetch all cars on mount
  useEffect(() => {
    fetchAllCars();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, allCars]);

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Paginate the filtered data
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredCars.length / pageSize);

  // Select a random car when no car is selected
  const randomCar = filteredCars.length > 0 ? filteredCars[0] : null;

  return (
    <div className="bg-background sm:p-16 xs:p-6 w-full flex sm:flex-row flex-col sm:items-start items-center justify-between">
      {/* Main Content */}
      <div className="bg-white sm:p-12 xs:p-4 pt-14 rounded-lg sm:w-[65%] w-full border flex flex-col items-center sm:items-center">
        
          <h2 className="text-xl font-bold mb-4">Available Cars</h2>
        
        <div className="grid sm:grid-cols-2 grid-cols-1 sm:gap-12 gap-6">
          {paginatedCars.length > 0 ? (
            paginatedCars.map((car) => (
              <CarCard
                {...car}
                key={car.id}
                onViewCalculation={() => setSelectedCar(car)}
              />
            ))
          ) : (
            <p>No cars available for the selected filters.</p>
          )}
        </div>
        {/* Pagination Component */}
        {totalPages > 1 && (
          <Pagination className="w-full">
            <PaginationContent className="w-full flex justify-between">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Side Component */}
      <div className="sm:w-[33%] w-full">
        {selectedCar ? (
          <CalculationSide
            car={selectedCar} // Use selected car or random fallback
            onClose={() => setSelectedCar(null)}
          />
        ) : (
          <div className="hidden sm:block text-center blur-sm">
              <CalculationSide car={randomCar} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarList;
