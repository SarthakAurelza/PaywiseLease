import Disclaimer from "@/components/Disclaimer";
import Info from "@/components/Info";
import { addToComparison, removeFromComparison } from "@/features/filtersSlice";
import supabase from "@/supabase/supabaseClient";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useQuoteData from '@/hooks/useQuoteData'; // assuming this exists


const CompareCars = () => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const { fetchQuoteData } = useQuoteData();

  const [carDetails, setCarDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [allCars, setAllCars] = useState([]); // All cars fetched from the database
  const [brands, setBrands] = useState([]); // Unique car brands
  const [filters, setFilters] = useState({ search: "", expandedBrand: null }); // Filters for search and accordions
  const { salary, leaseTerm, yearlyKm, state } = useSelector((state) => state.filters.userPreferences);
  const [filteredCars, setFilteredCars] = useState([]); // Cars filtered by brand and search
  const [suggestions, setSuggestions] = useState([]); // Suggestions for live search
  const selectedOption = useSelector((state)=>state.filters.selectedOption);
  const quotes = useSelector((state)=>state.filters.carQuotes);
  const [loadingQuotes, setLoadingQuotes] = useState({});

  const totalSlots = 3; // Total comparison slots (e.g., Select Car placeholders)

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (comparisonCars.length === 0) {
        setCarDetails([]);
        return;
      }

      const table = selectedOption === 'know' ? 'test_data_dump2': 'Car_Details';
      const carIds = comparisonCars.map((car) => car.id);
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .in("id", carIds);

      if (error) {
        console.error("Error fetching car details:", error);
        return;
      }

      setCarDetails(data);
    };

    fetchCarDetails();
  }, [comparisonCars]);

  // Fetch all cars when the modal opens
  useEffect(() => {
    const fetchAllCars = async () => {
      try {
        const table = selectedOption === 'know' ? 'test_data_dump2': 'Car_Details';
        const { data, error } = await supabase.from(table).select("*");
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

    if (isModalOpen) {
      fetchAllCars();
    }
  }, [isModalOpen]);

  // Filter cars based on search input and expanded brand
  useEffect(() => {
    let cars = [...allCars];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      cars = cars.filter(
        (car) =>
          `${car.brand} ${car.model} ${car.variant}`
            .toLowerCase()
            .includes(searchTerm)
      );

      // Generate suggestions
      const liveSuggestions = cars.map(
        (car) => `${car.brand} ${car.model} ${car.variant}`
      );
      setSuggestions([...new Set(liveSuggestions)]);
    } else {
      setSuggestions([]);
    }

    if (filters.expandedBrand) {
      cars = cars.filter((car) => car.brand === filters.expandedBrand);
    }

    setFilteredCars(cars);
  }, [filters, allCars]);

  const handleAccordionToggle = (brand) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      expandedBrand: prevFilters.expandedBrand === brand ? null : brand,
    }));
  };

  const handleAddCar = async (car) => {
  dispatch(addToComparison(car));
  setIsModalOpen(false); // Close the modal after selecting a car

  // Immediately fetch the quote after adding to comparison
  try {
    const vehiclePayload = {
      brand: car.brand,
      model: car.model,
      yearGroup: car.yearGroup,
    };

    const quotePayload = {
      state,
      annualSalary: salary,
      leaseTerm: leaseTerm * 12,
      annualKms: yearlyKm,
      hasHECS: false,
      age: 35,
      includeGAP: true,
      includeRoadSide: false,
    };
    setLoadingQuotes((prev) => ({ ...prev, [car.id]: true }));

    const quote = await fetchQuoteData(vehiclePayload, quotePayload);

    dispatch({
      type: "filters/setQuoteForCar",
      payload: { carId: car.id, quoteData: quote },
    });
  } catch (err) {
    console.error("Quote fetch failed on add:", car.id, err);
  }finally {
  setLoadingQuotes((prev) => ({ ...prev, [car.id]: false }));
  }
};


  const featureKeys = [
    { key: "engine", label: "Engine" },
    { key: "seats", label: "Seats" },
    { key: "body", label: "Body Type" },
    { key: "fuel_consumption", label: "Fuel Consumption" },
    { key: "transmission", label: "Transmission" },
    { key: "price", label: "Price" }, // Example field, adjust as needed
  ];

  useEffect(() => {
  const fetchQuotesForComparisonCars = async () => {
    for (const car of carDetails) {
      const existingQuote = quotes[car.id];
      if (existingQuote) continue;

      try {
        const vehiclePayload = {
          brand: car.brand,
          model: car.model,
          yearGroup: car.yearGroup,
        };

        const quotePayload = {
          state,
          annualSalary: salary,
          leaseTerm: leaseTerm * 12, // assuming monthly → annual
          annualKms: yearlyKm,
          hasHECS: false,
          age: 35,
          includeGAP: true,
          includeRoadSide: false,
        };

        const quote = await fetchQuoteData(vehiclePayload, quotePayload);

        dispatch({
          type: "filters/setQuoteForCar",
          payload: { carId: car.id, quoteData: quote },
        });
      } catch (err) {
        console.error("Quote fetch failed for", car.id, err);
      }
    }
  };

  if (carDetails.length > 0) {
    fetchQuotesForComparisonCars();
  }
}, [carDetails, quotes, salary, leaseTerm, yearlyKm, state]);


  return (
    <>
      <div className="w-full h-full md:px-8 lg:px-16 pb-16 flex flex-col">
        <div className="w-full h-full rounded-xl bg-white lg:p-16 p-2 xs:p-4 py-8">
          <div className="flex items-center justify-start mb-8 mt-8">
            {console.log(comparisonCars)}
            {comparisonCars.map((car, index) => (
              <span
                key={car.id}
                className="font-bold text-primary lg:text-[22px] md:text-[18px]"
              >
                {car.brand.toUpperCase()} {car.model.toUpperCase()}
                {index < comparisonCars.length - 1 && (
                  <span className="lg:mx-4 md:mx-2 mx-1 text-gray-500 lg:text-xl md:text-sm">
                    &amp;
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="text-primary font-light md:text-sm lg:text-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat..
          </p>

          {/* 
            -----------------------------------------
            TABLE VIEW (hidden on small screens)
            -----------------------------------------
          */}
          <div className="overflow-x-auto pt-12 hidden md:block">
            {comparisonCars.length === 0 ? (
              // Show only the "Select Car" boxes when no cars are selected
              <div className="flex justify-between">
                {Array.from({ length: totalSlots }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center border border-gray-300 rounded-lg w-1/3 mx-2 py-12 cursor-pointer"
                    onClick={() => setIsModalOpen(true)} // Open the modal
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-full mb-4">
                      <img src="/images/carIcon.png" alt="Select Car" />
                    </div>
                    <p className="font-semibold text-primary">Select Car</p>
                  </div>
                ))}
              </div>
            ) : (
              // Show the full table when cars are selected
              <table
                className="table-auto border-collapse border border-gray-300 w-full text-left"
                style={{ tableLayout: "fixed", width: "100%" }}
              >
                <thead>
                  <tr>
                    <th className="border border-gray-300 font-normal px-4 py-2 w-1/4 lg:text-md text-sm">
                      Finances
                    </th>
                    {Array.from({ length: totalSlots }).map((_, index) => {
                      const comparisonCar = comparisonCars[index];
const car = carDetails.find(c => c.id === comparisonCar?.id);
// Get the car for this slot if it exists
                      return (
                        <th
                          key={index}
                          className="border border-gray-300 px-1 py-4 text-center w-1/4 relative"
                        >
                          {car ? (
                            <div className="relative">
                              {/* Close (X) button */}
                              <button
                                className="absolute top-1 right-1 rounded-full border border-muted text-muted text-xl hover:text-primary hover:bg-gray-100 py-0 px-2"
                                onClick={() => dispatch(removeFromComparison(car.id))}
                              >
                                ×
                              </button>

                              <div className="flex flex-col items-center justify-around p-1 gap-4">
                                <img
                                  className="w-[80%]"
                                  src={selectedOption ==='know'?`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg` : car.imageUrl}
                                  alt={car.model}
                                />
                                <div className="w-full flex flex-col lg:text-lg md:text-xs">
                                  {car.brand.toUpperCase()} {car.model.toUpperCase()}{" "}
                                  <br />
                                  
                                </div>

                                <div className="w-full rounded-xl h-14 bg-gray-100 flex flex-row items-center justify-between text-xs px-1 py-2">
                                  <p>
                                    From{" "}
                                    <span className="text-xl font-semibold">
                                      {quotes?.[car.id]?.periodicCalculations?.[0]?.cost?.totalLeaseNet
  ? `$${Math.round(quotes[car.id].periodicCalculations[0].cost.totalLeaseNet)}`
  : loadingQuotes[car.id]
    ? "Loading..."
    : "Fetching..."}

                                    </span>

                                    /week
                                  </p>
                                  <button className="bg-primary text-white py-1 px-2 rounded-lg text-xs h-8 font-normal">
                                    View Calculation
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex flex-col items-center justify-center cursor-pointer"
                              onClick={() => setIsModalOpen(true)} // Open the modal
                            >
                              <div className="w-20 h-20 bg-gray-100 rounded-full mb-4">
                                <img src="/images/carIcon.png" alt="Select Car" />
                              </div>
                              <p className="font-semibold text-primary">Select Car</p>
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {featureKeys.map((feature) => (
                    <tr key={feature.key}>
                      <td className="border border-gray-300 px-4 py-4 w-1/4 lg:text-md text-sm">
                        {feature.label}
                      </td>
                      {Array.from({ length: totalSlots }).map((_, index) => {
                        const comparisonCar = comparisonCars[index];
                        const car = carDetails.find((c) => c.id === comparisonCar?.id); // Get the car for this slot if it exists
                        return (
                          <td
                            key={`${index}-${feature.key}`}
                            className="border border-gray-300 px-4 py-2 text-center lg:text-md text-sm text-[#808080] w-1/4"
                          >
                            {car && car[feature.key] !== undefined
                              ? car[feature.key]
                              : "---"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 
            -----------------------------------------
            SINGLE-COLUMN VIEW (mobile only)
            -----------------------------------------
          */}
          <div className="block md:hidden mt-8">
  {comparisonCars.length === 0 ? (
    /* No cars selected -> show "Select Car" placeholders */
    <div className="grid grid-cols-3">
      {Array.from({ length: totalSlots }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-3 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-[80%] rounded-full mb-4 flex items-center justify-center">
            <img src="/images/carIcon.png" alt="Select Car" />
          </div>
          <p className="font-semibold text-primary text-xs">Select Car</p>
        </div>
      ))}
    </div>
  ) : (
    /* Show selected cars in a grid with 3 columns */
    <div className="grid grid-cols-3">
      {comparisonCars.map((car) => (
        <div
          key={car.id}
          className="border border-gray-300 rounded-lg p-1 relative"
        >
          {/* Close (X) button */}
          <button
            className="absolute top-1 right-[1px] rounded-full border border-muted text-muted hover:text-primary text-xs hover:bg-gray-100 py-0 px-[5px]"
            onClick={() => dispatch(removeFromComparison(car.id))}
          >
            ×
          </button>

          {/* Car image and basic info */}
          <div className="flex flex-col items-center gap-3">
            <img
              className="w-full object-contain"
              src={car.imageUrl}
              alt={car.model}
            />
            <h3 className="font-bold text-primary text-center text-xs">
              {car.brand.toUpperCase()} {car.model.toUpperCase()}
              <br/>

            
            </h3>
          </div>
        </div>
      ))}

      {/* Fill remaining slots with "Select Car" placeholders */}
      {comparisonCars.length < totalSlots &&
        Array.from({ length: totalSlots - comparisonCars.length }).map(
          (_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-3 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="rounded-full flex items-center justify-center">
                <img className="w-[80%] mb-2" src="/images/carIcon.png" alt="Select Car" />
              </div>
              <p className="font-semibold text-primary text-xs">Select Car</p>
            </div>
          )
        )}
    </div>
  )}

  {/* Features Table */}
  {comparisonCars.length > 0 && (
  <div className="mt-6 border-t pt-4">
    <h3 className="text-lg font-semibold text-primary mb-2 text-center">
      Features Comparison
    </h3>
    <div className="flex flex-col gap-0">
      {featureKeys.map((feature) => (
        <div key={feature.key} className="rounded-lg mb-2">
          <h4 className="font-semibold text-sm text-center bg-gray-100 py-3">
            {feature.label}
          </h4>
          <div className="grid grid-cols-3 text-center">
            {comparisonCars.map((car) => (
              <span
                key={`${car.id}-${feature.key}`}
                className="text-sm text-gray-600 border w-full h-full px-1 py-3 flex items-center justify-center"
              >
                {car[feature.key] !== undefined && car[feature.key] !== null
                  ? car[feature.key]
                  : "---"}  {/* Ensure all cells have borders */}
              </span>
            ))}
            {/* Add empty cells to maintain the grid structure if no data is present */}
            {comparisonCars.length < 3 && [...Array(3 - comparisonCars.length)].map((_, index) => (
              <span
                key={`empty-${feature.key}-${index}`}
                className="text-sm text-gray-600 border w-full h-full px-1 py-3 flex items-center justify-center"
              >
                ---  {/* Placeholder content for empty cells */}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

</div>

          
        </div>

        {/* Modal for Selecting a Car */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-gray-200 px-3 py-1 rounded-full font-bold hover:bg-gray-300"
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
                  onChange={(e) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      search: e.target.value,
                    }))
                  }
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
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            search: suggestion,
                          }));
                          setSuggestions([]); // Clear suggestions after selection
                        }}
                      >
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand Accordions */}
              <div className="overflow-y-auto max-h-[60vh]">
                {brands.map((brand) => (
                  <div key={brand} className="border-b">
                    {/* Accordion Header */}
                    <div
                      className="cursor-pointer flex justify-between items-center px-4 py-2"
                      onClick={() => handleAccordionToggle(brand)}
                    >
                      <h3 className="text-lg">{brand}</h3>
                      <span
                        className={`transform transition-transform ${
                          filters.expandedBrand === brand ? "rotate-180" : ""
                        }`}
                      >
                        <img src="/images/down.png" alt="" />
                      </span>
                    </div>

                    {/* Show models when accordion is expanded */}
                    {filters.expandedBrand === brand && (
                      <div className="px-4 py-2">
                        {filteredCars
                          .filter((car) => car.brand === brand)
                          .map((car) => (
                            <div
                              key={car.id}
                              className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-100"
                              onClick={() => handleAddCar(car)}
                            >
                              <span>
                                {car.brand} {car.model} - {car.variant}
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
      </div>
      <Disclaimer />
      <Info />
    </>
  );
};

export default CompareCars;
