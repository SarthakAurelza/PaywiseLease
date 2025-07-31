import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToComparison } from "@/features/filtersSlice";
import { useNavigate } from "react-router-dom";
import SelectCarModal from "./SelectCarModal";
import usefetchAllCars from "@/hooks/usefetchAllCars";
import useVehicleData from "@/hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import { setQuoteForCar } from "@/features/filtersSlice";
import useSearchSuggestions from "@/hooks/useSearchSuggestions";
import CompareModal from "./CompareModal";

const CompareButton = () => {
  const dispatch = useDispatch();
  const { fetchVehicleData } = useVehicleData();
const { fetchQuoteData } = useQuoteData();

  const navigate = useNavigate();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const quoteTime = useSelector((state) => state.filters.quoteTime);
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const [selectedTable, setSelectedTable] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectCarModalOpen, setIsSelectCarModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", expandedBrand: null });

  const { cars:allCars, brands } = usefetchAllCars(selectedTable, filters);
  const suggestions = useSearchSuggestions(allCars, filters.search);

  useEffect(() => {
    if (selectedOption) {
      const table = selectedOption === "know" ? "test_data_dump2" : "Car_Details";
      setSelectedTable(table);
    }
  }, [selectedOption]);

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

  const handleAddCar = async (car) => {
  dispatch(addToComparison(car));
  setIsSelectCarModalOpen(false);

  // ✅ Fetch quote data for this car immediately
  try {
    const vehicleData = await fetchVehicleData(car.brand, car.model, car.yearGroup);
    const quote = await fetchQuoteData(vehicleData, {
      state: "NSW",          // <-- Replace with actual user input if available
      annualSalary: 60000,   // <-- Replace with dynamic value
      leaseTerm: 36,         // <-- Replace with dynamic value
      annualKms: 15000,      // <-- Replace with dynamic value
      hasHECS: false,
      age: 35,
      includeGAP: true,
      includeRoadSide: false,
    });

    if (quote) {
      dispatch(setQuoteForCar({ carId: car.id, quoteData: quote }));
    }
  } catch (err) {
    console.error("Failed to fetch quote for car:", car, err);
  }
};


  const handleCompareClick = () => {
    if (comparisonCars.length >= 2) {
      navigate("/compare");
    } else {
      alert("You need at least two cars to compare.");
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-1 left-2 bg-[#41b6e6] text-primary px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
      >
        <span className="font-semibold">Compare Cars</span>
        <div className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {comparisonCars.length}
        </div>
      </div>

      {isModalOpen && (
        <CompareModal
          onClose={() => setIsModalOpen(false)}
          onSelectCarOpen={() => setIsSelectCarModalOpen(true)}
          onCompareClick={handleCompareClick}
        />
      )}

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
    </>
  );
};

export default CompareButton;
