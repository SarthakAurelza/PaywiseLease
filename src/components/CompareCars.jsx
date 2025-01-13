import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison } from "@/features/filtersSlice";
import supabase from "../supabase/supabaseClient";
import { Button } from "./ui/button";

const CompareCars = () => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const [carDetails, setCarDetails] = useState([]);

  const totalSlots = 3; // Total comparison slots (e.g., Select Car placeholders)

  useEffect(() => {
    const fetchCarDetails = async () => {
      if (comparisonCars.length === 0) {
        setCarDetails([]);
        return;
      }

      const carIds = comparisonCars.map((car) => car.id);
      const { data, error } = await supabase
        .from("Car_Details")
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

  const featureKeys = [
    { key: "engine", label: "Engine" },
    { key: "seats", label: "Seats" },
    { key: "body", label: "Body Type" },
    { key: "fuel_consumption", label: "Fuel Consumption" },
    { key: "transmission", label: "Transmission" },
    { key: "price", label: "Price" }, // Example field, adjust as needed
  ];

  return (
    <div className="w-full h-full pl-16 pr-16 flex flex-col">
      <div className="w-full h-full rounded-xl bg-white p-16">
        <h2 className="text-3xl mb-8">Compare Cars</h2>
        <p className="text-primary font-light">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..
        </p>

        <div className="overflow-x-auto pt-12">
          {comparisonCars.length === 0 ? (
            // Show only the "Select Car" boxes when no cars are selected
            <div className="flex justify-between">
              {Array.from({ length: totalSlots }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center border border-gray-300 rounded-lg w-1/3 mx-2 py-12"
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
                  <th className="border border-gray-300 px-4 py-2 w-1/4">
                    Finances
                  </th>
                  {Array.from({ length: totalSlots }).map((_, index) => {
                    const car = carDetails[index]; // Get the car for this slot if it exists
                    return (
                      <th
                        key={index}
                        className="border border-gray-300 px-1 py-2 text-center w-1/4 relative"
                      >
                        {car ? (
                          <div className="relative">
                            {/* Close (X) button */}
                            <button
                              className="absolute top-1 right-1 text-red-500 text-xl font-bold hover:text-red-700"
                              onClick={() =>
                                dispatch(removeFromComparison(car.id))
                              }
                            >
                              ×
                            </button>

                            <div className="flex flex-col items-center justify-around p-1 gap-4">
                              <img
                                className="w-[80%]"
                                src={car.imageUrl}
                                alt={car.model}
                              />
                              <div className="w-full flex flex-col text-lg">
                                {car.brand.toUpperCase()}{" "}
                                {car.model.toUpperCase()} <br />
                                <span className="font-medium text-sm">
                                  {car.variant.toUpperCase()}
                                </span>
                              </div>

                              <div className="w-full rounded-xl bg-background py-2 px-1 flex gap-2 items-center justify-around">
                                <p className="font-bold text-lg">
                                  <span className="sm:text-[8px] text-xs sm:font-semibold">
                                    FROM{" "}
                                  </span>
                                  $370
                                  <span className="sm:text-[10px] text-xs">
                                    /week
                                  </span>
                                </p>
                                <button className="bg-primary text-white text-xs rounded-md p-1 sm:pl-3 sm:pr-3 h-7">
                                  View Calculation
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center">
                            {/* Placeholder for Car Icon */}
                            <div className="w-20 h-20 bg-gray-100 rounded-full mb-4">
                              <img
                                src="/images/carIcon.png"
                                alt="Select Car"
                              />
                            </div>
                            <p className="font-semibold text-primary">
                              Select Car
                            </p>
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
                    <td className="border border-gray-300 px-4 py-2 font-semibold w-1/4">
                      {feature.label}
                    </td>
                    {Array.from({ length: totalSlots }).map((_, index) => {
                      const car = carDetails[index]; // Get the car for this slot if it exists
                      return (
                        <td
                          key={`${index}-${feature.key}`}
                          className="border border-gray-300 px-4 py-2 text-center w-1/4"
                        >
                          {car && car[feature.key] !== undefined
                            ? car[feature.key]
                            : "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareCars;
