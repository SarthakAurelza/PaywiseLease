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
import { setQuoteForCar } from '@/features/filtersSlice';
import { useDispatch } from 'react-redux';
import usefetchAllCars from '@/hooks/usefetchAllCars';
import useFilteredCars from '@/hooks/useFilteredCars';
import UserPreferences from './UserPreferences';
import SortFilterMenu from './SortFilterMenu';

const CarList = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters); // Use only filters from Redux
  const selectedOption = useSelector((state)=>state.filters.selectedOption);
  const { salary, leaseTerm, yearlyKm, state } = useSelector((state) => state.filters.userPreferences);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pageSize, setPageSize] = useState(4); // Default page size
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); 
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


  // Fetch all cars once and cache them
  const { cars: allCars, loading: carsLoading, error: carsError, refresh: refreshCars } = usefetchAllCars();

  useEffect(() => {
    if (selectedOption) {
      const table = selectedOption === 'know' ? 'test_data_dump2': 'Car_Details';
      console.log("selected table: ",table);
      setSelectedTable(table);
    }else{
      console.log("thenga")
    }
  }, [selectedOption]);

  const filteredCars = useFilteredCars(allCars, filters, sortCriteria, sortOrder);

  // Handle pagination change
  const handlePageChange = (page, event) => {
    event.preventDefault(); // Prevent default anchor behavior
    setCurrentPage(page);
  };

  useEffect(() => {
    if (loading) return; // Prevent new API calls if data is already being fetched

    const paginatedCars = filteredCars.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    fetchVehicleDataForPage(paginatedCars);
}, [filteredCars, currentPage, pageSize, salary, leaseTerm, yearlyKm]);

useEffect(() => {
  setQuoteDataMap({}); // Wipe old quotes
}, [salary, leaseTerm, yearlyKm, state]);




  const fetchVehicleDataForPage = async (cars) => {
  if (!cars.length) return;

  setLoading(true);

  // Debounce calls
  if (window.vehicleFetchTimeout) clearTimeout(window.vehicleFetchTimeout);

  window.vehicleFetchTimeout = setTimeout(async () => {
    const vehicleDataResults = await Promise.allSettled(
      cars.map((car) =>
        fetchVehicleData(car.brand, car.model, car.yearGroup)
      )
    );

    const updatedVehicleDataMap = {};
    cars.forEach((car, index) => {
      if (vehicleDataResults[index].status === "fulfilled") {
        updatedVehicleDataMap[car.id] = vehicleDataResults[index].value;
      }
    });

    setVehicleDataMap((prev) => ({ ...prev, ...updatedVehicleDataMap }));

    // 🚀 Only fetch quotes *after* vehicle data is fully loaded
    fetchQuoteDataForPage(cars, updatedVehicleDataMap);

    setLoading(false);
  }, 200); // Faster debounce helps prevent skipping
};



const fetchQuoteDataForPage = async (cars, vehicleData) => {
  if (!cars.length) return;

  if (window.quoteFetchTimeout) {
    clearTimeout(window.quoteFetchTimeout);
  }

  window.quoteFetchTimeout = setTimeout(async () => {
    console.log("Fetching quote data for:", cars);

    for (const car of cars) {
      const vehicle = vehicleData[car.id];
      if (!vehicle) continue;

      const userInput = {
        salary,
        leaseTerm,
        yearlyKm,
        state,
      };

      const existingQuote = quoteDataMap[car.id];
      const existingInput = existingQuote?.userInput;

      const isSameInput =
        existingInput &&
        existingInput.salary === userInput.salary &&
        existingInput.leaseTerm === userInput.leaseTerm &&
        existingInput.yearlyKm === userInput.yearlyKm &&
        existingInput.state === userInput.state;

      if (isSameInput) continue; // ✅ Skip if quote is fresh

      try {
        const quote = await fetchQuoteData(vehicle, {
          state,
          annualSalary: salary,
          leaseTerm: leaseTerm * 12,
          annualKms: yearlyKm,
          hasHECS: false,
          age: 35,
          includeGAP: true,
          includeRoadSide: false,
        });

        const enriched = {
          ...quote,
          userInput, // ✅ Embed input for comparison
        };

        setQuoteDataMap((prev) => ({ ...prev, [car.id]: enriched }));
        dispatch(setQuoteForCar({ carId: car.id, quoteData: enriched }));
      } catch (error) {
        console.error(`❌ Failed for car ${car.id}:`, error);
      }
    }
  }, 500); // Lower delay to make UI more responsive
};



  // Paginate the filtered data
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredCars.length / pageSize);

  // Select a random car when no car is selected
  const randomCar = filteredCars.length > 0 ? filteredCars[0] : null;

  useEffect(() => {
  const retryTimer = setTimeout(() => {
    const missing = paginatedCars.filter(car => !quoteDataMap[car.id]);
    if (missing.length > 0) {
      console.warn("Retrying quote fetch for missing cars:", missing);
      fetchVehicleDataForPage(missing);
    }
  }, 4000); // Retry after 4s if nothing fetched

  return () => clearTimeout(retryTimer);
}, [paginatedCars, quoteDataMap]);

  return (
    <>
      <h2 className='w-full lg:pr-16 lg:pl-16 lg:pt-16 pb-4 pr-4 pl-4 pt-8 xs:pr-6 xs:pl-6 xs:pt-10 xs:text-lg sm:text-md md:text-lg lg:text-xl xl:text-2xl 3xl:text-3xl'>About You</h2>
      <div className='w-full h-auto gap-3 xs:gap-3 grid justify-items-center xs:grid-cols-2 md:flex md:flex-row md:items-center md:justify-between lg:px-16 xs:px-6 px-4  pb-8'>
        <UserPreferences  />
      </div>
      <div className="bg-background md:p-6 lg:p-16 xs:p-6 w-full flex sm:flex-row flex-col sm:items-start items-center justify-between">
        {/* Main Content */}
        <div className="bg-white md:p-5 p-4 sm:p-6 lg:p-12 xs:p-8 pt-8 xs:pt-14 rounded-lg w-full lg:w-[66%] xl:w-[68%] flex flex-col items-center sm:items-center">
          <div className='w-full flex flex-col'>
            <div className='flex items-center justify-between mb-6 xs:mb-10'>
              <h2 className=" xs:text-lg lg:text-xl font-bold mb-4 xl:text-2xl 2xl:text-3xl xxl:text-4xl 3xl:text-5xl">Available Cars</h2>
              <SortFilterMenu
                show={showFilterDropdown}
                toggle={() => setShowFilterDropdown(!showFilterDropdown)}
                setSortCriteria={setSortCriteria}
                toggleSortOrder={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                sortCriteria={sortCriteria}
              />
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 grid-cols-1 xxl:grid-cols-3 gap-10 xs:gap-8 sm:gap-8 md:gap-1 lg:gap-4 xl:gap-12 xxl:gap-12 justify-stretch justify-items-center w-[100%]">
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
            <div className="relative w-full h-full border-4 border-white rounded-md">
              <div className="blur-[22px]">
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
