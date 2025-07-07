import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison } from "@/features/filtersSlice";

import CompareModal from "@/components/comparison/CompareModal";
import { buttons, containers, typography } from "@/components/typography/typography";
import PriceLoader from "@/components/Card_Components/PriceLoader";
import SelectCarModal from "@/components/SelectCarModal";
import usefetchAllCars from "@/hooks/usefetchAllCars";
import useSearchSuggestions from "@/hooks/useSearchSuggestions";
import { addToComparison } from "@/features/filtersSlice";
import useVehicleData from "@/hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import Info from "@/components/Info";
import Disclaimer from "@/components/Disclaimer";

const featureKeys = [
  { key: "engine", label: "Engine" },
  { key: "seats", label: "Seats" },
  { key: "body", label: "Body Type" },
  { key: "fuel_consumption", label: "Fuel Consumption" },
  { key: "transmission", label: "Transmission" },
  { key: "price", label: "Price" },
];

const CompareCars = () => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const carQuotes = useSelector((state) => state.filters.carQuotes);
  const quoteTime = useSelector((state) => state.filters.quoteTime);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isSelectCarModalOpen, setIsSelectCarModalOpen] = useState(false);
  const totalSlots = 3;
  const { fetchVehicleData } = useVehicleData();
  const { fetchQuoteData } = useQuoteData();

  const handleAddCar = async (car) => {
    dispatch(addToComparison(car));
    setIsSelectCarModalOpen(false);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccordionToggle = (brand) => {
    setFilters((prev) => ({
      ...prev,
      expandedBrand: prev.expandedBrand === brand ? null : brand,
    }));
  };

  const [filters, setFilters] = useState({ search: "", expandedBrand: null });

  const { cars:allCars, brands } = usefetchAllCars(selectedTable, filters);
  const suggestions = useSearchSuggestions(allCars, filters.search);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLeaseAmount = (quote) => {
    const indexMap = { Weekly: 0, Monthly: 1, Fortnightly: 2 };
    const leaseIndex = indexMap[quoteTime] ?? 0;
    return quote?.periodicCalculations?.[leaseIndex]?.cost?.totalLeaseNet ?? null;
  };

  return (
    <>
    <div className="w-full p-20">
      <h1 className="text-3xl font-semibold mb-8">Compare Cars</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="p-4 border-b font-medium text-gray-700 bg-gray-100 align-top w-[15%]">
                Feature
              </th>
              {Array.from({ length: totalSlots }).map((_, index) => {
                const car = comparisonCars[index];
                const quote = car ? carQuotes[car.id] : null;
                const leaseAmount = getLeaseAmount(quote);

                return (
                  <th key={index} className="p-0 border-b bg-gray-100 align-top w-[300px]">
                    <div className={typography.card.carCard}>
                      {car ? (
                        <>
                          <div className="relative w-full">
                            <img
                              src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/no-image.jpeg";
                              }}
                              alt={car.model}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                            <button
                              className={`absolute top-2 right-2 ${buttons.roundButton}`}
                              onClick={() => dispatch(removeFromComparison(car.id))}
                            >
                              x
                            </button>
                          </div>

                          <div className="mt-3 w-full">
                            <h4 className={typography.heading.h4}>
                              {car.brand?.toUpperCase()} {car.model?.toUpperCase()}
                            </h4>
                            <p className="text-sm text-primary font-medium flex flex-wrap">
                              {car.variant || "Base Model"}
                            </p>
                          </div>

                          {leaseAmount ? (
                            <div className={containers.price_container}>
                              <p className={typography.content.price_content}>
                                <span className="text-[10px] md:text-[12px] font-light xl:text-md">
                                  FROM{" "}
                                </span>
                                <span className="flex flex-row items-center">
                                  <span className="text-xl md:text-2xl font-semibold">
                                    ${Math.round(leaseAmount)}
                                  </span>
                                  <span className="text-[12px] font-light xl:text-md sm:text-[14px] ml-1">
                                    /{quoteTime.toLowerCase()}
                                  </span>
                                </span>
                              </p>
                              <button className={buttons.view_calculation}>View Calculation</button>
                            </div>
                          ) : (
                            <PriceLoader />
                          )}
                        </>
                      ) : (
                        <div
                          className="w-full h-full flex flex-col justify-center items-center cursor-pointer min-h-[200px]"
                          onClick={() => setIsSelectCarModalOpen(true)}
                        >
                          <img
                            src="/images/carIcon.png"
                            alt="Select Car"
                            className="w-16 h-16 mb-4"
                          />
                          <span className="text-sm font-semibold text-primary">
                            Select Car
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {featureKeys.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600 border-b bg-gray-50">{label}</td>
                {Array.from({ length: totalSlots }).map((_, idx) => {
                  const car = comparisonCars[idx];
                  return (
                    <td key={idx} className="p-4 border-b align-top text-gray-800">
                      {car?.[key] || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Car Select Modal */}
      {isSelectCarModalOpen && (
        <SelectCarModal
        onClose={() => setIsSelectCarModalOpen(false)}
          filters={filters}
          suggestions={suggestions}
          allCars={allCars}
          brands={brands}
          handleAddCar={handleAddCar}
          handleAccordionToggle={handleAccordionToggle}
          handleFilterChange={handleFilterChange}
        />
      )}
    </div>

    <Disclaimer />
    <Info />
    </>

  );
};

export default CompareCars;
