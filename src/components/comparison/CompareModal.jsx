import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison } from "@/features/filtersSlice";
import { buttons, containers, grids, typography } from "../typography/typography";
import PriceLoader from "../Card_Components/PriceLoader";

const CompareModal = ({ onClose, onSelectCarOpen, onCompareClick }) => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars || []);
  const carQuotes = useSelector((state) => state.filters.carQuotes || {});
  const quoteTime = useSelector((state) => state.filters.quoteTime || "Weekly");
  const userPreferences = useSelector((state) => state.filters.userPreferences);

  const totalSlots = 3;
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl p-4 md:p-10 relative flex flex-col gap-6 overflow-y-scroll max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">Selected Cars</h2>
          <button onClick={onClose} className={buttons.roundButton}>
            X
          </button>
        </div>

        {/* Car Slots */}
        <div className={grids.compareGrid}>
          {Array.from({ length: totalSlots }).map((_, index) => {
            const car = comparisonCars[index];
            console.log("car in modal: ",car)
            const leaseAmount = car?.leasePrices?.weekly || null;

            return (
              <div key={index} className={typography.card.carCard}>
                {car ? (
                  <>
                    {/* Image + Remove Button */}
                    <div className="relative w-full">
                      <img
                        src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/no-image.jpeg";
                        }}
                        alt={car.model}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        className={`absolute top-2 right-2 ${buttons.roundButton}`}
                        onClick={() => dispatch(removeFromComparison(car.id))}
                      >
                        x
                      </button>
                    </div>

                    {/* Title */}
                    <div className="mt-3 w-full">
                      <h4 className={typography.heading.h4}>
                        {car.brand?.toUpperCase()} {car.model?.toUpperCase()}
                      </h4>
                      <p className="text-sm text-primary font-medium">
                        {car.variant?.split(" ").slice(0, 4).join(" ") || "Base Model"}
                      </p>
                    </div>

                    {/* Price Area */}
                    {leaseAmount ? (
                      <div className={containers.price_container}>
                        <p className={typography.content.price_content}>
                          <span className="text-[10px] md:text-[12px] font-light xl:text-md">FROM </span>
                          <span className="flex flex-row items-center">
                            <span className="text-xl md:text-2xl font-semibold">
                              ${Math.round(leaseAmount)}
                            </span>
                            <span className="text-[12px] font-light xl:text-md sm:text-[14px] ml-1">
                              /week
                            </span>
                          </span>
                        </p>
                        <button
                          className={buttons.view_calculation}
                          onClick={(e) => {
                            e.stopPropagation();
                            // You should pass in `onViewCalculation` prop or handle it here
                          }}
                        >
                          View Calculation
                        </button>
                      </div>
                    ) : (
                      <PriceLoader />
                    )}
                  </>
                ) : (
                  // Empty Slot
                  <div
                    className="w-full h-full flex flex-col justify-center items-center cursor-pointer"
                    onClick={onSelectCarOpen}
                  >
                    <img src="/images/carIcon.png" alt="Select Car" className="w-24 h-24 mb-2" />
                    <span className="text-sm font-semibold text-primary">Select Car</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Compare Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onCompareClick}
            className="bg-secondary text-primary font-semibold px-6 py-2 rounded-2xl shadow"
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
