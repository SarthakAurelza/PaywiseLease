import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison } from "@/features/filtersSlice";

const CompareButton = ({ compareCarsRef }) => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const totalSlots = 3; // Total comparison slots
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
    console.log(comparisonCars);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleCompareClick = () => {
    setIsModalOpen(false); // Close the modal
    if (compareCarsRef?.current) {
      compareCarsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-red-500 font-bold"
            >
              X
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-bold mb-6">Selected Cars</h2>

            {/* Display selected cars and placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: totalSlots }).map((_, index) => {
                const car = comparisonCars[index]; // Get the car for the current slot, if available
                return (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-md bg-gray-50 flex flex-col items-center justify-center"
                  >
                    {car ? (
                      <>
                        <img
                          className="w-full h-32 object-cover rounded-lg mb-2"
                          src={car.imageUrl}
                          alt={car.model}
                        />
                        <h3 className="text-lg font-semibold mb-2">
                          {car.brand} {car.model}
                        </h3>
                        <p className="text-sm">
                          <strong>Finances:</strong> $370/week
                        </p>
                        {/* Remove button */}
                        <button
                          onClick={() => dispatch(removeFromComparison(car.id))}
                          className="text-red-500 text-sm mt-2"
                        >
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Placeholder for "Select Car" */}
                        <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                        <p className="text-sm font-semibold text-primary">
                          Select Car
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compare Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCompareClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareButton;
