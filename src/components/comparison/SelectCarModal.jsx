import React, { useEffect, useState } from "react";
import axios from "axios"; // don't forget to import this
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import useAllBrands from "@/hooks/useAllBrands";
import useAllModels from "@/hooks/useAllModels";
import { useDispatch, useSelector } from "react-redux";
import { addToComparison } from "@/features/filtersSlice";

const SelectCarModal = ({ onClose}) => {
  const dispatch = useDispatch();
  const { allBrands } = useAllBrands();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const { allModels } = useAllModels(selectedBrand);

  const comparisonCars = useSelector((state) => state.filters.comparisonCars);

  useEffect(() => {
    if (!selectedBrand || !selectedModel) return;

    const fetchAllCars = async () => {
      setLoading(true);
      try {
        const query = `${selectedBrand} ${selectedModel}`;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/search?q=${encodeURIComponent(query)}`
        );

        console.log("teh cars fetched are: ",res.data.hits)
        const exactMatches = (res.data.hits || []).filter(
          (car) =>
            car.brand?.toLowerCase() === selectedBrand.toLowerCase() &&
            car.model?.toLowerCase() === selectedModel.toLowerCase()
        );
        console.log("the exactmatches are: ",exactMatches)
        setAllCars(exactMatches); // full car objects now
      } catch (err) {
        console.error("❌ Failed to fetch variants:", err);
        setAllCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCars();
  }, [selectedBrand, selectedModel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[50%] h-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full bg-gray-200 px-2 py-1 font-bold hover:bg-gray-300"
        >
          X
        </button>

        <h2 className="text-2xl text-primary mb-4 font-bold">Select a Car</h2>

        <Accordion
          type="single"
          collapsible
          className="w-full h-[90%] overflow-y-auto"
          value={selectedBrand}
          onValueChange={(value) => {
            setSelectedBrand(value);
            setSelectedModel(null); // reset model when brand changes
            setAllCars([]);
          }}
        >
          {allBrands.map((brand) => (
            <AccordionItem key={brand} value={brand}>
              <AccordionTrigger className="text-xl p-2">{brand}</AccordionTrigger>
              <AccordionContent>
                {(allModels || []).map((model) => (
                  <div key={model} className="pl-4">
                    <div
                      className={`cursor-pointer hover:bg-gray-100 rounded text-lg px-2 py-1 ${
                        selectedModel === model ? "bg-gray-100 font-semibold" : ""
                      }`}
                      onClick={() => setSelectedModel(model)}
                    >
                      {model}
                    </div>

                    {/* Show cars under the selected model */}
                    {selectedModel === model && (
                      <div className="ml-4 mt-1">
                        {loading && <div className="text-sm italic text-gray-500">Loading cars...</div>}
                        {!loading && allCars.length === 0 && (
                          <div className="text-sm italic text-gray-500">No cars found.</div>
                        )}
                        {allCars.map((car) => (
                          <div
                            key={car.id}
                            className="cursor-pointer hover:bg-blue-100 px-3 py-2 text-md text-primary rounded "
                            onClick={() => {
                              console.log("Car selected:", car)
                              dispatch(addToComparison(car));
                              onClose()
                            }
                            }
                          >
                            {car.fullName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default SelectCarModal;
