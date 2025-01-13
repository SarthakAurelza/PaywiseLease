import React, { useState } from "react";
import { useSelector } from "react-redux";

const CompareButton = () => {
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const carCount = comparisonCars.length;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true); // Open the modal on button click
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
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
          {carCount}
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
            {comparisonCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {comparisonCars.map((car) => (
                  <div
                    key={car.id}
                    className="border p-4 rounded-lg shadow-md bg-gray-50"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm">
                      <strong>Variant:</strong> {car.variant || "N/A"}
                    </p>
                    <p className="text-sm">
                      <strong>Finances:</strong> $370/week
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No cars selected for comparison.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CompareButton;

