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
import useVehicleData from '@/hooks/useVehicleData';
import useQuoteData from '@/hooks/useQuoteData';

const CarList = () => {
  const filters = useSelector((state) => state.filters); // Use only filters from Redux
  const selectedOption = useSelector((state)=>state.filters.selectedOption);
  const [selectedTable, setSelectedTable] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pageSize, setPageSize] = useState(4); // Default page size
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); 
  const entireState = useSelector((state)=>state);
  const [vehicleDataMap, setVehicleDataMap] = useState({});
  const [quoteDataMap, setQuoteDataMap] = useState({});
  const { fetchVehicleData } = useVehicleData();
  const { fetchQuoteData } = useQuoteData();
  

  const xxlBreakpoint = 1820;

  // Update page size based on screen size
  const updatePageSize = () => {
    if (window.innerWidth >= xxlBreakpoint || (window.innerWidth >= 768 && window.innerWidth < 1200)) {
      setPageSize(6); // Use 6 for xl screens
    } else {
      setPageSize(4); // Default to 4 for smaller screens
    }
  };

  // Add event listener for window resize
  useEffect(() => {
    updatePageSize(); // Set initial page size
    window.addEventListener('resize', updatePageSize);
    return () => {
      window.removeEventListener('resize', updatePageSize);
    };
  }, []);

  // Dropdown options
  const salaryOptions = ['0-50,000', '50,000-100,000', '100,000+'];
  const leaseTermOptions = ['0-5yrs', '5-10yrs', '10+ yrs'];
  const stateOptions = ['Choose State', 'Sydney', 'Melbourne', 'Adelaide'];
  const yearlyKmOptions = ['0-2,000Km', '2,000-10,000Km', '10,000+Km'];

  // Fetch all cars once and cache them
  const fetchAllCars = async () => {

    setLoading(true);
    try {
      console.log("Fetching from table: ",selectedTable);
      const { data, error } = await supabase.from(selectedTable).select('*');
      if (error) {
        console.error('Supabase error:', error.message);
        setAllCars([]);
      } else {
        console.log("Fetched Cars:", data);
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
    if (filters.price.min !== undefined && filters.price.max !== undefined) {
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

    setFilteredCars(filtered);
  };

  useEffect(() => {
    if (selectedOption) {
      const table = selectedOption === 'know' ? 'test_data_dump2': 'Car_Details';
      console.log("selected table: ",table);
      setSelectedTable(table);
    }else{
      console.log("thenga")
    }
  }, [selectedOption]);


  // Fetch all cars on mount
  useEffect(() => {
    if(selectedTable){
      fetchAllCars();
    }
    
  }, [selectedTable]);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, allCars, sortCriteria,sortOrder,selectedOption]);

  // Handle pagination change
  const handlePageChange = (page, event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setCurrentPage(page);
  };

  useEffect(() => {
    const paginatedCars = filteredCars.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    fetchVehicleDataForPage(paginatedCars);
  }, [filteredCars, currentPage, pageSize]);

  const fetchVehicleDataForPage = async (cars) => {
    const vehicleDataPromises = cars.map((car) => fetchVehicleData(car.brand, car.model, car.yearGroup));
    
    const vehicleDataResults = await Promise.allSettled(vehicleDataPromises);
    const updatedVehicleDataMap = {};

    cars.forEach((car, index) => {
      if (vehicleDataResults[index].status === "fulfilled") {
        updatedVehicleDataMap[car.id] = vehicleDataResults[index].value;
      }
    });
    
    setVehicleDataMap((prev) => ({ ...prev, ...updatedVehicleDataMap }));
    fetchQuoteDataForPage(cars, updatedVehicleDataMap);
  };

  const fetchQuoteDataForPage = async (cars, vehicleData) => {
    for (const car of cars) {
      if (!vehicleData[car.id]) continue;
      try {
        const quoteResponse = await fetchQuoteData(vehicleData[car.id], {
          state: "NSW",
          annualSalary: 120000,
          leaseTerm: 48,
          annualKms: 15000,
          hasHECS: false,
          age: 35,
          includeGAP: true,
          includeRoadSide: false,
        });
        setQuoteDataMap((prev) => ({ ...prev, [car.id]: quoteResponse }));
      } catch (error) {
        console.error(`Failed to fetch quote data for car ${car.id}:`, error);
      }
    }
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
      <h2 className='w-full lg:pr-16 lg:pl-16 lg:pt-16 pb-4 pr-4 pl-4 pt-8 xs:pr-6 xs:pl-6 xs:pt-10 xs:text-lg sm:text-md md:text-lg lg:text-xl xl:text-2xl 3xl:text-3xl'>About You</h2>
      <div className='w-full h-auto gap-3 xs:gap-3 grid justify-items-center xs:grid-cols-2 sm:flex sm:flex-row sm:items-center sm:justify-between lg:px-16 xs:px-6 px-4  pb-8'>
        <div className='w-full flex flex-col'>
          <p className='text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2 3xl:text-2xl'>Salary</p>
          <select className='rounded-md p-3 sm:p-1 md:p-2 lg:p-3 xs:p-2 w-[100%] xs:w-[100%] sm:w-[95%] lg:w-[90%] 3xl:text-2xl'>
            {salaryOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2 3xl:text-2xl'>Lease Term</p>
          <select className='rounded-md p-3 sm:p-1 md:p-2 lg:p-3 xs:p-2 xs:w-[100%] sm:w-[95%] lg:w-[90%] 3xl:text-2xl'>
            {leaseTermOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2 3xl:text-2xl'>State</p>
          <select className='rounded-md p-3 sm:p-1 md:p-2 lg:p-3 xs:p-2 xs:w-[100%] sm:w-[95%] lg:w-[90%] 3xl:text-2xl'>
            {stateOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className='w-full flex flex-col'>
          <p className='text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2 3xl:text-2xl'>Yearly Km</p>
          <select className='rounded-md p-3 sm:p-1 md:p-2 lg:p-3 xs:p-2 xs:w-[100%] sm:w-[95%] lg:w-[90%] 3xl:text-2xl'>
            {yearlyKmOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-background md:p-6 lg:p-16 xs:p-6 w-full flex sm:flex-row flex-col sm:items-start items-center justify-between">
        {/* Main Content */}
        <div className="bg-white md:p-5 p-4 sm:p-6 lg:p-12 xs:p-8 pt-8 xs:pt-14 rounded-lg w-full lg:w-[65%] xl:w-[68%] flex flex-col items-center sm:items-center">
          <div className='w-full flex flex-col'>
            <div className='flex items-center justify-between mb-6 xs:mb-10'>
              <h2 className=" xs:text-lg lg:text-xl font-bold mb-4 xl:text-2xl 2xl:text-3xl xxl:text-4xl 3xl:text-5xl">Available Cars</h2>
              <div className='flex items-center gap-4'>
              <div className='relative'>
                <img
                  className='cursor-pointer 3xl:w-12'
                  src="/images/filter.png"
                  alt="Filter"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                />
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
                    <ul>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSortCriteria('price');
                          setShowFilterDropdown(false);
                        }}
                      >
                        Price (Ascending)
                      </li>
                      <li
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          setSortCriteria('fuel_consumption');
                          setShowFilterDropdown(false);
                        }}
                      >
                        Fuel Consumption (Ascending)
                      </li>
                    </ul>
                  </div>
                )}
              </div>


              <img
                className='cursor-pointer 3xl:w-12'
                src="/images/sort.png"
                alt="Sort"
                onClick={() => {
                  sortCriteria && setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
                }}
              />

              </div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 grid-cols-1 xxl:grid-cols-3 gap-10 xs:gap-8 sm:gap-8 md:gap-1 lg:gap-8 xl:gap-12 xxl:gap-12 justify-stretch justify-items-center w-[100%]">
              {paginatedCars.length > 0 ? (
                paginatedCars.map((car) => (
                  <CarCard
                    {...car}
                    key={car.id}
                    quoteData={quoteDataMap[car.id]}
                    onViewCalculation={() => {
                      setSelectedCar(car);
                      if (window.innerWidth < 1200) {
                        setShowPopup(true);
                      }
                    }}
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

        <div className="hidden lg:block lg:w-[33%] xl:w-[31%] xxl:w-[27%] w-full">
          {selectedCar ? (
            <CalculationSide
              car={selectedCar}
              quoteData = {quoteDataMap[selectedCar.id]}
              onClose={() => setSelectedCar(null)}
            />
          ) : (
            <div className="relative w-full h-full border">
              <div className="blur-md border">
                <CalculationSide car={randomCar} />
              </div>
              {/* Message over the blurred background */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-center text-lg font-semibold text-primary bg-[#F3F6F7] p-8 w-[70%] border border-muted rounded-xl">
                  Select a car to check Calculation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Popup for small screens */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center h-[100%]">
            <div className="bg-white rounded-lg md:p-2 lg:p-6 w-[90%] max-w-lg md:h-[95%] sm:h-[90%] h-[75%]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowPopup(false)}
              >
                &times;
              </button>
              <CalculationSide
                car={selectedCar}
                onClose={() => setShowPopup(false)}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CarList;
