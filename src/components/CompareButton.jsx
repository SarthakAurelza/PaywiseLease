import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison, addToComparison } from "@/features/filtersSlice";
import { useNavigate } from "react-router-dom";
import supabase from "@/supabase/supabaseClient";

const CompareButton = ({ compareCarsRef }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const totalSlots = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectCarModalOpen, setIsSelectCarModalOpen] = useState(false);
  const [allCars, setAllCars] = useState([]);
  const [availableCars, setAvailableCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    expandedBrand: null,
  });
  const [suggestions, setSuggestions] = useState([]);

  const fetchAllCars = async () => {
    try {
      const { data, error } = await supabase.from("Car_Details").select("*");
      if (error) {
        console.error("Error fetching cars:", error);
        return;
      }

      setAllCars(data);

      // Extract unique brands
      const uniqueBrands = [...new Set(data.map((car) => car.brand))].filter(Boolean);
      setBrands(uniqueBrands);
    } catch (err) {
      console.error("Unexpected error fetching cars:", err);
    }
  };

  const filterCars = () => {
    let filteredCars = [...allCars];

    if (filters.expandedBrand) {
      filteredCars = filteredCars.filter((car) => car.brand === filters.expandedBrand);
    }

    setAvailableCars(filteredCars);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    // Live search suggestions
    if (name === "search") {
      const searchValue = value.toLowerCase();
      if (searchValue) {
        const filteredSuggestions = allCars
          .filter((car) =>
            `${car.brand} ${car.model} ${car.variant}`
              .toLowerCase()
              .includes(searchValue)
          )
          .map((car) => ({
            id: car.id,
            name: `${car.brand} ${car.model} ${car.variant}`,
          }));
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleAccordionToggle = (brand) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      expandedBrand: prevFilters.expandedBrand === brand ? null : brand,
    }));
  };

  const handleAddCar = (car) => {
    console.log(car);
    dispatch(addToComparison(car));
    setIsSelectCarModalOpen(false);
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseSelectCarModal = () => {
    setIsSelectCarModalOpen(false);
  };

  const handleCompareClick = () => {
    if (comparisonCars.length >= 2) {
      navigate("/compare");
    } else {
      alert("You need at least two cars to compare.");
    }
  };

  useEffect(() => {
    if (isSelectCarModalOpen) {
      fetchAllCars();
    }
  }, [isSelectCarModalOpen]);

  useEffect(() => {
    filterCars();
  }, [filters.expandedBrand, allCars]);

  return (
    <>
      {/* Compare Button */}
      <div
        onClick={handleButtonClick}
        className="fixed bottom-1 left-2 bg-secondary text-primary px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer hover:bg-secondary"
      >
        <span className="font-semibold">Compare Cars</span>
        <div className="bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {comparisonCars.length}
        </div>
      </div>

      {/* Main Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full font-bold"
            >
              X
            </button>

            <h2 className="text-2xl text-primary mb-6">Selected Cars</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: totalSlots }).map((_, index) => {
                const car = comparisonCars[index];
                return (
                  <div
                    key={index}
                    className="border rounded-lg shadow-md bg-gray-50 flex flex-col items-center justify-center p-3"
                  >
                    {car ? (
                      <>
                        <div className="flex flex-row items-start">
                          <img
                            className="w-[100%] h-28 object-cover rounded-lg mb-2"
                            src={car.imageUrl}
                            alt={car.model}
                          />
                          <button
                            className="px-2 py-0 text-muted border-muted font-bold hover:bg-gray-100 rounded-full border"
                            onClick={() => dispatch(removeFromComparison(car.id))}
                          >
                            x
                          </button>
                        </div>
                        {console.log(car)}
                        <h3 className="text-lg font-semibold mb-2">
                          {car.brand.toUpperCase()} {car.model.toUpperCase()} <br/> <span className="font-normal text-primary text-sm">{car.variant  || "BASE MODEL"}</span>
                        </h3>

                        <div className="w-full rounded-xl h-14 bg-gray-200 flex flex-row items-center justify-between text-xs p-1">
                          <p>From <span className="text-lg font-semibold">$370</span>/week</p>
                          <button className="bg-primary text-white py-1 px-[10px] rounded-lg text-xs h-8">View Calculation</button>
                        </div>
                      </>
                    ) : (
                      <div
                        className="w-20 h-full mb-4 cursor-pointer flex flex-col items-center justify-around"
                        onClick={() => setIsSelectCarModalOpen(true)}
                      >
                        <img src="/images/carIcon.png" alt="Select Car" />
                        <span className="text-sm font-semibold text-primary">
                          Select Car
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCompareClick}
                className="bg-secondary text-primary px-4 py-2 rounded-2xl shadow font-semibold"
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Select Car Modal */}
      {isSelectCarModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[50%] max-w-4xl rounded-lg p-6 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={handleCloseSelectCarModal}
              className="absolute top-4 right-4 rounded-full bg-gray-200 px-2 py-1 font-bold hover:bg-gray-300"
            >
              X
            </button>

            <h2 className="text-2xl text-primary mb-4">Select a Car</h2>

            {/* Search Bar */}
            <div className="mb-4 relative">
              <input
                type="text"
                name="search"
                placeholder="Search cars..."
                className="w-full border rounded-lg px-3 py-2"
                onChange={handleFilterChange}
                value={filters.search}
              />
              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto w-full z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const selectedCar = allCars.find((car) => `${car.brand} ${car.model} ${car.variant}` === suggestion.name);
                        if (selectedCar) handleAddCar(selectedCar);
                      }}
                    >
                      {suggestion.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Accordions */}
            <div className="overflow-y-auto max-h-[50vh]">
              {brands.map((brand) => (
                <div key={brand} className="border-b text-muted-foreground">
                  {/* Accordion Header */}
                  <div
                    className="cursor-pointer flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleAccordionToggle(brand)}
                  >
                    <h3 className="text-lg">{brand}</h3>
                    {/* Arrow Icon */}
                    <span
                      className={`transform transition-transform duration-300 ${
                        filters.expandedBrand === brand ? "rotate-180" : ""
                      }`}
                    >
                      <img src="/images/down.png" alt="" />
                    </span>
                  </div>

                  {/* Show models when accordion is expanded */}
                  {filters.expandedBrand === brand && (
                    <div className="px-4 py-2 text-foreground">
                      {availableCars
                        .filter((car) => car.brand === brand)
                        .map((car) => (
                          <div
                            onClick={() => handleAddCar(car)}
                            key={car.id}
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
      )}
    </>
  );
};

export default CompareButton;
