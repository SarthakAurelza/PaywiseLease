import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison, addToComparison } from "@/features/filtersSlice";
import supabase from "@/supabase/supabaseClient";

const CompareButton = ({ compareCarsRef }) => {
  const dispatch = useDispatch();
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
  };

  const handleAccordionToggle = (brand) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      expandedBrand: prevFilters.expandedBrand === brand ? null : brand,
    }));
  };

  const handleAddCar = (car) => {
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
    setIsModalOpen(false);
    if (compareCarsRef?.current) {
      compareCarsRef.current.scrollIntoView({ behavior: "smooth" });
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
        className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full flex items-center gap-2 shadow-lg cursor-pointer hover:bg-green-600"
      >
        <span className="font-semibold">Compare Cars</span>
        <div className="bg-white text-green-500 w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {comparisonCars.length}
        </div>
      </div>

      {/* Main Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-300 px-3 py-1 rounded-full font-bold"
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
                    className="border p-4 rounded-lg shadow-md bg-gray-50 flex flex-col items-center justify-center"
                  >
                    {car ? (
                      <>
                        <div className="flex flex-row items-start">
                          <img
                            className="w-[92%] h-32 object-cover rounded-lg mb-2"
                            src={car.imageUrl}
                            alt={car.model}
                          />
                          <button
                            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full"
                            onClick={() => dispatch(removeFromComparison(car.id))}
                          >
                            X
                          </button>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {car.brand} {car.model}
                        </h3>
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
                className="bg-secondary text-primary px-4 py-2 rounded-2xl shadow"
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
                onChange={(e) => {
                  handleFilterChange(e);
                }}
                value={filters.search}
                readOnly // Makes the search bar non-functional
              />
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
