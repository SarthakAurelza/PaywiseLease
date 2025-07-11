import useVehicles from '@/hooks/useVehicles';
import React, { useState } from 'react'
import SkeletonLoader from './SkeletonLoader';
import CarCard from './CarCard';
import FiltersBar from './FiltersBar';
import CalculationSide from './CalculationSide';

const CarList = () => {
  const { cars, prices, loading, filters, setFilters, options, currentPage, setCurrentPage, totalPages } = useVehicles();
  const [selectedCar,setSelectedCar] = useState(null)
  console.log(cars); 
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex flex-row justify-between'>
        <div className='w-[65%] bg-white'>
          {
            loading ? (
              <SkeletonLoader />
            ) : (
              <>
              <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-2 md:gap-12 lg:gap-4 xl:gap-8 w-full justify-between xxl:grid-cols-3 xxl:gap-4">
                {cars.map(car => (
                  <CarCard
                    key={car.vehicleID || car.id || car.model}
                    car={car}
                    price={prices[car.vehicleID || car.id || car.model]}
                    onViewCalculation={() => {
                        setSelectedCar(car);
                        if (window.innerWidth < 1200) setShowPopup(true);
                      }}
                  />
                ))}
              </div>
              <div className="pagination" style={{ marginTop: 24, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>&lt; Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next &gt;</button>
              </div>
            </>
            )
          }
        </div>

        <div className="hidden lg:block lg:w-[35%] xl:w-[31%] xxl:w-[27%] w-full">
          {selectedCar ? (
            <CalculationSide
              car={selectedCar}
              price={prices[selectedCar?.vehicleID || selectedCar?.id || selectedCar?.model]}
              onClose={() => setSelectedCar(null)}
            />
          ) : (
            <div className="relative w-full h-full border-4 border-white rounded-md">
              <div className="blur-[22px]">
                <CalculationSide car={cars[0]} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <p className="text-center text-lg font-semibold text-primary bg-[#F3F6F7] p-8 w-[70%] border border-muted rounded-xl">
                  Select a car to check Calculation
                </p>
              </div>
            </div>
          )}
        </div>
          
      </div>
    </div>
  )
}

export default CarList
