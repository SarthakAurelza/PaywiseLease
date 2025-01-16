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

  // Dropdown options
  const salaryOptions = ['0-50,000', '50,000-100,000', '100,000+'];
  const leaseTermOptions = ['0-5yrs', '5-10yrs', '10+ yrs'];
  const stateOptions = ['Choose State', 'Sydney', 'Melbourne', 'Adelaide'];
  const yearlyKmOptions = ['0-2,000Km', '2,000-10,000Km', '10,000+Km'];

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
  const handlePageChange = (page, event) => {
    event.preventDefault(); // Prevent default anchor behavior
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
    <>
      <h2 className='w-full pt-16 pl-16 pr-16 pb-4 text-xl'>About You</h2>
      <div className='w-full h-auto flex flex-row items-center justify-between pl-16 pr-16'>
        <div className='w-full flex flex-col'>
          <p className='text-primary'>Salary</p>
          <select className='rounded-md p-3 w-[90%]'>
            {salaryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary'>Lease Term</p>
          <select className='rounded-md p-3 w-[90%]'>
            {leaseTermOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary'>State</p>
          <select className='rounded-md p-3 w-[90%]'>
            {stateOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary'>Yearly Km</p>
          <select className='rounded-md p-3 w-[90%]'>
            {yearlyKmOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-background sm:p-16 xs:p-6 w-full flex sm:flex-row flex-col sm:items-start items-center justify-between">
        {/* Main Content */}
        <div className="bg-white sm:p-12 xs:p-4 pt-14 rounded-lg sm:w-[65%] w-full border flex flex-col items-center sm:items-center">
          <div>
          <div className='flex items-center justify-between'>
            <h2 className="text-xl font-bold mb-4">Available Cars</h2>
            <div className='flex items-center gap-4'>
              <img className='cursor-pointer' src="/images/filter.png" alt="" />
              <img className='cursor-pointer' src="/images/sort.png" alt="" />
            </div>
          </div>
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
          </div>
          {/* Pagination Component */}
          {totalPages > 1 && (
            <Pagination className="w-full pt-8">
              <PaginationContent className="w-full flex justify-between">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => handlePageChange(currentPage - 1, e)}
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
                    onClick={(e) => handlePageChange(currentPage + 1, e)}
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
    </>
  );
};

export default CarList;
