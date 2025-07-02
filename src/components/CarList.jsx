import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import usefetchAllCars from '@/hooks/usefetchAllCars';
import useFilteredCars from '@/hooks/useFilteredCars';
import UserPreferences from './MainSite_Components/UserPreferences';
import SortFilterMenu from './SortFilterMenu';
import { typography } from './typography/typography';
import PaginationControls from './MainSite_Components/PaginationControls';

const CarList = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const { salary, leaseTerm, yearlyKm, state } = useSelector((state) => state.filters.userPreferences);

  const [selectedTable, setSelectedTable] = useState(null);
  const [loadingPageData, setLoadingPageData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [pageSize, setPageSize] = useState(4);
  const [showPopup, setShowPopup] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [vehicleDataMap, setVehicleDataMap] = useState({});
  const [quoteDataMap, setQuoteDataMap] = useState({});
  const { fetchVehicleData } = useVehicleData();
  const { fetchQuoteData } = useQuoteData();

  const { cars: allCars, loading: carsLoading, error: carsError } = usefetchAllCars();

  const xxlBreakpoint = 1840;

  const updatePageSize = () => {
    if (window.innerWidth >= xxlBreakpoint) {
      setPageSize(6);
    } else {
      setPageSize(4);
    }
  };

  useEffect(() => {
    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    if (selectedOption) {
      const table = selectedOption === 'know' ? 'test_data_dump2' : 'Car_Details';
      console.log('selected table: ', table);
      setSelectedTable(table);
    }
  }, [selectedOption]);

  const filteredCars = useFilteredCars(allCars, filters, sortCriteria, sortOrder);
  const paginatedCars = filteredCars.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredCars.length / pageSize);
  const randomCar = filteredCars.length > 0 ? filteredCars[0] : null;

  const handlePageChange = (page, event) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  useEffect(() => {
    setQuoteDataMap({});
  }, [salary, leaseTerm, yearlyKm, state]);

  useEffect(() => {
    if (!paginatedCars.length) return;
    setLoadingPageData(true);

    if (window.vehicleFetchTimeout) clearTimeout(window.vehicleFetchTimeout);
    window.vehicleFetchTimeout = setTimeout(async () => {
      const vehicleDataResults = await Promise.allSettled(
        paginatedCars.map((car) => fetchVehicleData(car.brand, car.model, car.yearGroup))
      );

      const updatedVehicleDataMap = {};
      paginatedCars.forEach((car, index) => {
        if (vehicleDataResults[index].status === 'fulfilled') {
          updatedVehicleDataMap[car.id] = vehicleDataResults[index].value;
        }
      });

      setVehicleDataMap((prev) => ({ ...prev, ...updatedVehicleDataMap }));

      fetchQuoteDataForPage(paginatedCars, updatedVehicleDataMap);
      setLoadingPageData(false);
    }, 200);
  }, [filteredCars, currentPage, pageSize, salary, leaseTerm, yearlyKm]);

  const fetchQuoteDataForPage = async (cars, vehicleData) => {
    if (!cars.length) return;

    if (window.quoteFetchTimeout) clearTimeout(window.quoteFetchTimeout);

    window.quoteFetchTimeout = setTimeout(async () => {
      for (const car of cars) {
        const vehicle = vehicleData[car.id];
        if (!vehicle) continue;

        const userInput = { salary, leaseTerm, yearlyKm, state };
        const existingQuote = quoteDataMap[car.id];
        const existingInput = existingQuote?.userInput;

        const isSameInput =
          existingInput &&
          existingInput.salary === userInput.salary &&
          existingInput.leaseTerm === userInput.leaseTerm &&
          existingInput.yearlyKm === userInput.yearlyKm &&
          existingInput.state === userInput.state;

        if (isSameInput) continue;

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

          const enriched = { ...quote, userInput };

          setQuoteDataMap((prev) => ({ ...prev, [car.id]: enriched }));
          dispatch(setQuoteForCar({ carId: car.id, quoteData: enriched }));
        } catch (error) {
          console.error(`❌ Failed for car ${car.id}:`, error);
        }
      }
    }, 300);
  };

  useEffect(() => {
    const retryTimer = setTimeout(() => {
      const missing = paginatedCars.filter((car) => !quoteDataMap[car.id]);
      if (missing.length > 0) {
        console.warn('Retrying quote fetch for missing cars:', missing);
        fetchVehicleDataForPage(missing);
      }
    }, 4000);
    return () => clearTimeout(retryTimer);
  }, [paginatedCars, quoteDataMap]);

  const fetchVehicleDataForPage = async (cars) => {
    if (!cars.length) return;
    const results = await Promise.allSettled(
      cars.map((car) => fetchVehicleData(car.brand, car.model, car.yearGroup))
    );
    const updatedVehicleDataMap = {};
    cars.forEach((car, index) => {
      if (results[index].status === 'fulfilled') {
        updatedVehicleDataMap[car.id] = results[index].value;
      }
    });
    setVehicleDataMap((prev) => ({ ...prev, ...updatedVehicleDataMap }));
    fetchQuoteDataForPage(cars, updatedVehicleDataMap);
  };


  return (
    <>
      <h3 className={typography.heading.h3}>About You</h3>
      <div className='w-full h-auto'>
        <UserPreferences />
      </div>

      <div className="bg-background md:p-6 lg:p-16 xs:p-6 w-full flex sm:flex-row flex-col sm:items-start items-center justify-between">
        <div className="bg-white md:p-5 p-4 sm:p-6 lg:p-12 xs:p-8 pt-8 xs:pt-14 rounded-lg w-full lg:w-[66%] xl:w-[68%] flex flex-col items-center sm:items-center">
          <div className='w-full flex flex-col'>
            <div className='flex items-center justify-between mb-6 xs:mb-10'>
              <h2 className={typography.heading.h2}>Available Cars</h2>
              <SortFilterMenu
                show={showFilterDropdown}
                toggle={() => setShowFilterDropdown(!showFilterDropdown)}
                setSortCriteria={setSortCriteria}
                toggleSortOrder={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                sortCriteria={sortCriteria}
              />
            </div>

            {carsLoading ? (
              <p className="text-center w-full py-10">🚗 Loading cars... Please wait.</p>
            ) : (
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-2 md:gap-12 lg:gap-4 xl:gap-8 w-full justify-between xxl:grid-cols-3 xxl:gap-4">
                {paginatedCars.length > 0 ? (
                  paginatedCars.map((car,index) => {
                    const alignment = index % 2 === 0 ? 'place-self-start' : 'place-self-end';
                    return <CarCard
                      {...car}
                      key={car.id}
                      quoteData={quoteDataMap[car.id]}
                      loading={loadingPageData && !quoteDataMap[car.id]}
                      onViewCalculation={() => {
                        setSelectedCar(car);
                        if (window.innerWidth < 1200) setShowPopup(true);
                      }}
                      alignmentClass={alignment}
                    />
                  })
                ) : (
                  <p>No cars available for the selected filters.</p>
                )}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </div>

        <div className="hidden lg:block lg:w-[35%] xl:w-[31%] xxl:w-[27%] w-full">
          {selectedCar ? (
            <CalculationSide
              car={selectedCar}
              quoteData={quoteDataMap[selectedCar.id]}
              onClose={() => setSelectedCar(null)}
            />
          ) : (
            <div className="relative w-full h-full border-4 border-white rounded-md">
              <div className="blur-[22px]">
                <CalculationSide car={randomCar} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-center text-lg font-semibold text-primary bg-[#F3F6F7] p-8 w-[70%] border border-muted rounded-xl">
                  Select a car to check Calculation
                </p>
              </div>
            </div>
          )}
        </div>

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
                quoteData={quoteDataMap[selectedCar.id]}
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
