import React, { useEffect, useState } from "react";
import useFetchCars from "@/hooks/useFetchCars";
import SkeletonLoader from "./SkeletonLoader";
import CarCard from "../Card_Components/CarCard";
import UserPreferences from "./UserPreferences";
import CalculationSide from "../calculationSide/CalculationSide";
import { buttons, typography } from "../typography/typography";
import Filter from "../Filter";
import SortFilterMenu from "./SortFilterMenu";

const CarList = () => {
  const { cars, loading, currentPage, setCurrentPage, totalPages, allVehicles } = useFetchCars();
  const [selectedCar, setSelectedCar] = useState(null);
  const [carLeaseMap, setCarLeaseMap] = useState([]);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    if (showMobileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMobileModal]);


  useEffect(() => {
    setCarLeaseMap(allVehicles);
  }, [allVehicles]);

  const updateLeasePrices = (carId, leasePrices) => {
    setCarLeaseMap((prev) =>
      prev.map((car) => (car.id === carId ? { ...car, leasePrices } : car))
    );
  };

  const selectedCarFull = carLeaseMap.find((c) => c.id === selectedCar?.id) || selectedCar;

  return (
    <div className="w-full flex flex-col justify-start">
      <UserPreferences />

      <div className="w-full flex flex-row justify-center md:p-8 lg:px-20 py-10">
        <div className="lg:w-[65%] bg-white p-4 md:p-8 flex flex-col min-h-[900px] justify-between items-center rounded-lg">
          <div className="w-full flex flex-row items-center justify-between mb-10">
            <h2 className={typography.heading.h2}> Available Cars</h2>
            <SortFilterMenu />
          </div>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <>
              {
                cars.length>0 && (
                  <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:gap-12 xl:gap-8 xxl:grid-cols-3 xxl:gap-4">
                {cars
                  .filter((car) => car.leasePrices || car.powerPlant === "BEV")
                  .map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onUpdateLeasePrices={updateLeasePrices}
                      onViewCalculation={() => {
                        setSelectedCar(car);
                        if (window.innerWidth < 1200) {
                          setShowMobileModal(true);
                        }
                      }}
                    />
                  ))}
              </div>
                )
              }
              {cars.length===0 && (
                    <>
                      <img className="mt-24" src="/images/Car_notavailable.png" alt="" />
                      <p className="text-3xl text-muted-foreground font-bold">No Car Available for selected filters</p>
                    </>
              )}
            </>
          )}
          <div className="pagination mt-12 flex justify-between items-center gap-4 w-full">
                <button className={`hover:bg-primary hover:text-white ${buttons.compare_inactive} cursor-pointer`} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  &lt; Prev
                </button>
                <span className="text-primary font-semibold text-xs md:text-md">Page {currentPage} of {totalPages}</span>
                <button className={`hover:bg-primary hover:text-white ${buttons.compare_inactive} cursor-pointer`} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Next &gt;
                </button >
              </div>
        </div>

        <div className="hidden lg:block lg:w-[35%] xl:w-[31%] xxl:w-[27%] w-full">
          {selectedCar ? (
            <CalculationSide car={selectedCarFull} onClose={() => setSelectedCar(null)} />
          ) : (
            <div className="relative w-full border-4 border-white rounded-md">
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
        {showMobileModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-2 sm;px-6">
            <div className="bg-white w-full max-w-lg mx-auto rounded-lg overflow-y-auto max-h-[90vh] p-2">
              <CalculationSide
                car={selectedCarFull}
                onClose={() => {
                  setShowMobileModal(false);
                  setSelectedCar(null);
                }}
              />
            </div>
          </div>
        )}

    </div>
  );
};

export default CarList;
