import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToComparison, removeFromComparison } from "@/features/filtersSlice";

const CarCard = ({
  id,
  brand,
  engine,
  model,
  body,
  transmission,
  fuel_consumption,
  seats,
  onViewCalculation,
  imageUrl,
}) => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars); // Get comparison list from Redux

  const isInComparison = comparisonCars.some((car) => car.id === id); // Check if the car is already in the comparison list

  return (
    <div className="w-[290px] sm:h-[372px] p-3 pb-4 flex flex-col items-center rounded-xl bg-[#F3F6F7] justify-between gap-4">
      <div className="h-[40%] rounded-sm w-full">
        <img src={imageUrl} alt="" />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1">
          <p className="sm:text-[16px] font-semibold">{brand.toUpperCase()}</p>
          <p className="sm:text-[16px] font-semibold">{model.toUpperCase()}</p>
        </div>
        <Button
          className={`${
            isInComparison ? "bg-secondary text-black" : "bg-transparent text-primary"
          } font-semibold border rounded-xl h-5 w-[80px] text-[9px] border-muted`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering unwanted events
            if (isInComparison) {
              dispatch(removeFromComparison(id)); // Remove from comparison
            } else {
              dispatch(
                addToComparison({
                  id,
                  brand,
                  engine,
                  model,
                  body,
                  seats,
                  transmission,
                  fuel_consumption,
                  imageUrl, 
                  
                })
              )
            }
          }}
        >
          {isInComparison ? "Remove" : "Add to compare"}
        </Button>

      </div>
      <div className="w-full grid grid-cols-2 gap-4">
        <div>
          <p className="text-[#808080] font-light text-[12px]">Engine</p>
          <p className="text-[14px]">{engine}</p>
        </div>

        <div>
          <p className="text-[12px] font-light text-[#808080]">Body/Seats</p>
          <p className="text-[14px]">
            {body} - {seats}
          </p>
        </div>

        <div>
          <p className="text-[12px] font-light text-[#808080]">Transmission</p>
          <p className="text-[14px]">{transmission}</p>
        </div>

        <div>
          <p className="text-[12px] font-light text-[#808080]">Consumption</p>
          <p className="text-[14px]">{fuel_consumption}L/100Km</p>
        </div>
      </div>
      <div className="w-full bg-white h-12 p-2 pt-4 pb-4 rounded-md flex flex-row items-center justify-between">
        <p className="font-bold text-3xl text-primary">
          <span className="sm:text-[8px] text-xs sm:font-semibold">FROM </span>$370
          <span className="sm:text-[10px] text-xs">/week</span>
        </p>
        <button
          className="bg-primary text-white text-xs rounded-md p-1 pt-2 pb-2 sm:pl-3 sm:pr-3"
          onClick={onViewCalculation}
        >
          View Calculation
        </button>
      </div>
    </div>
  );
};

export default CarCard;
