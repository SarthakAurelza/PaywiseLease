import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison } from "@/features/filtersSlice";

const CompareModal = ({ onClose, onSelectCarOpen, onCompareClick }) => {
  const dispatch = useDispatch();

  const comparisonCars = useSelector((state) => state.filters.comparisonCars || []);
  const carQuotes = useSelector((state) => state.filters.carQuotes || {});
  const quoteTime = useSelector((state) => state.filters.quoteTime || "Weekly");

  const totalSlots = 3;

  const getLeaseAmount = (quote) => {
    if (!quote?.periodicCalculations || !Array.isArray(quote.periodicCalculations)) return null;

    let leaseIndex = 0;
    if (quoteTime === "Monthly") leaseIndex = 1;
    else if (quoteTime === "Fortnightly") leaseIndex = 2;

    return quote.periodicCalculations[leaseIndex]?.cost?.totalLeaseNet ?? null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-4xl rounded-lg p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full font-bold"
        >
          X
        </button>
        <h2 className="text-2xl text-primary mb-6">Selected Cars</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const car = comparisonCars[index];
            const quote = car ? carQuotes[car.id] : null;
            const leaseAmount = getLeaseAmount(quote);

            return (
              <div
                key={index}
                className="border rounded-lg shadow-md bg-gray-50 flex flex-col items-center justify-center p-3"
              >
                {car ? (
                  <>
                    <div className="flex flex-row items-start w-full">
                      <img
                        src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                        alt={car.model || "Car image"}
                        className="w-[94%] object-cover rounded-lg mb-2"
                        onError={(e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/images/no-image.jpeg'; // Replace with your fallback image path
  }}
                      />
                      <button
                        className="px-2 py-0 text-muted font-bold border-muted hover:bg-gray-100 border rounded-full"
                        onClick={() => dispatch(removeFromComparison(car.id))}
                      >
                        x
                      </button>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-center">
                      {car.brand?.toUpperCase()} {car.model?.toUpperCase()}
                      <br />
                      <span className="font-normal text-primary text-sm">
                        {car.variant || "BASE MODEL"}
                      </span>
                    </h3>

                    <div className="w-full rounded-xl h-14 bg-gray-200 flex flex-row items-center justify-between text-xs p-1 px-3">
                      {leaseAmount && typeof leaseAmount === "number" ? (
                        <p>
                          From{" "}
                          <span className="text-lg font-semibold">
                            ${Math.round(leaseAmount)}
                          </span>
                          /{quoteTime.toLowerCase()}
                        </p>
                      ) : (
                        <p className="italic text-gray-500">Loading price...</p>
                      )}
                      <button className="bg-primary text-white py-1 px-[10px] rounded-lg text-xs h-8">
                        View Calculation
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    className="w-20 h-full mb-4 cursor-pointer flex flex-col items-center justify-around"
                    onClick={onSelectCarOpen}
                  >
                    <img src="/images/carIcon.png" alt="Select Car" />
                    <span className="text-sm font-semibold text-primary">Select Car</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onCompareClick}
            className="bg-secondary text-primary px-4 py-2 rounded-2xl shadow font-semibold"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
