// components/CompareButton/SelectCarModal.jsx
import React from "react";
import useVehicleData from "@/hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import { setQuoteForCar } from "@/features/filtersSlice";


const SelectCarModal = ({
  onClose,
  filters = { search: "", expandedBrand: null },
  suggestions = [],
  handleFilterChange = () => {},
  allCars = [],
  brands = [],
  handleAddCar = () => {},
  handleAccordionToggle = () => {},
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[50%] max-w-4xl rounded-lg p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-gray-200 px-2 py-1 font-bold hover:bg-gray-300"
        >
          X
        </button>

        <h2 className="text-2xl text-primary mb-4">Select a Car</h2>

        <div className="mb-4 relative">
          <input
            type="text"
            name="search"
            placeholder="Search cars..."
            className="w-full border rounded-lg px-3 py-2"
            onChange={handleFilterChange}
            value={filters.search || ""}
          />
          {suggestions.length > 0 && (
            <div className="absolute bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto w-full z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    const selectedCar = allCars.find(
                      (car) =>
                        `${car.brand} ${car.model} ${car.variant}` === suggestion.name
                    );
                    if (selectedCar) {
                      handleAccordionToggle(selectedCar.brand); // ✅ Fix: open brand
                      handleAddCar(selectedCar);
                    }
                  }}
                >
                  {suggestion.name}
                </div>
              ))}

            </div>
          )}
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {(brands || []).map((brand) => (
            <div key={brand} className="border-b text-muted-foreground">
              <div
                className="cursor-pointer flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => handleAccordionToggle(brand)}
              >
                <h3 className="text-lg">{brand}</h3>
                <span
                  className={`transform transition-transform duration-300 ${
                    filters.expandedBrand === brand ? "rotate-180" : ""
                  }`}
                >
                  <img src="/images/down.png" alt="" />
                </span>
              </div>

              {filters.expandedBrand === brand && (
                <div className="px-4 py-2 text-foreground">
                  {console.log("Expanded brand:", brand)}
    {console.log("All cars for brand:", allCars.filter((car) => car.brand === brand))}
                  {(allCars || [])
                    .filter(car => car.brand.toLowerCase() === brand.toLowerCase())
                    .map((car) => (
                      <div
                        key={car.id}
                        onClick={() => handleAddCar(car)}
                        className="flex justify-between items-center"
                      >
                        <span className="hover:bg-gray-100 w-full py-2 cursor-pointer">
                          {car.model} - {car.variant}
                        </span>
                      </div>
                    ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectCarModal;
