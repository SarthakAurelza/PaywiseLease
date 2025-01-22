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
    <div className="w-[100%] max-w-[300px] xs:max-w-[310px]  md:max-w-72 lg:max-w-[100%] xs:h-[440px] sm:h-[372px] md:h-[350px] lg:h-[390px] xl:h-[510px] 2xl:h-[580px] xxl:h-[540px] p-3 xs:p-5 sm:p-2 md:p-2 lg:p-3 xl:p-4 pb-4 flex flex-col items-center rounded-xl bg-[#F3F6F7] justify-between gap-4">
      <div className="lg:h-[40%] xxl:h-[30%] rounded-sm w-full">
        <img className="xl:w-[100%]" src={imageUrl} alt="" />
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-1">
          <p className="sm:text-[12px] lg:text-[16px] xl:text-[20px] 2xl:text-2xl xxl:text-[20px] font-bold">{brand.toUpperCase()}</p>
          <p className="sm:text-[12px] lg:text-[16px] xl:text-[20px] xxl:text-[20px] 2xl:text-2xl font-bold">{model.toUpperCase()}</p>
        </div>
        <Button
          className={`${
            isInComparison ? "bg-secondary text-black" : "bg-transparent text-primary"
          } font-semibold border rounded-xl h-6 w-[100px] sm:h-4 sm:w-[70px] lg:h-5 lg:w-[80px] text-[10px] sm:text-[8px]  lg:text-[9px] xl:text-[12px] xl:w-[110px] xl:h-7 border-muted`}
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
      <div className="w-full grid grid-cols-2 justify-items-stretch sm:gap-[8px] lg:gap-4">
        <div>
          <p className="text-[#808080] font-light text-[14px] xs:text-md sm:text-[10px] lg:text-[12px] xl:text-[16px] 2xl:text-[18px]">Engine</p>
          <p className="text-[15px] xs:text-md sm:text-[12px] lg:text-[14px] 2xl:text-[20px] xl:text-[17px] xxl:text-[18px] font-semibold">{engine}</p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-[14px] xs:text-md sm:text-[10px] lg:text-[12px] 2xl:text-[18px] xl:text-[16px] font-light text-[#808080]">Body/Seats</p>
          <p className="text-[15px] xs:text-md  sm:text-[12px] lg:text-[14px] 2xl:text-[20px] xl:text-[17px] xxl:text-[18px] font-semibold">
            {body} - {seats}
          </p>
        </div>

        <div>
          <p className="text-[14px] xs:text-md sm:text-[10px] lg:text-[12px] 2xl:text-[18px] xl:text-[16px] font-light text-[#808080]">Transmission</p>
          <p className="text-[15px] xs:text-md  md:text-[12px] lg:text-[14px] 2xl:text-[20px] xxl:text-[18px] xl:text-[17px] font-semibold">{transmission}</p>
        </div>

        <div className="flex flex-col items-end">
          <p className="text-[14px] xs:text-md sm:text-[10px] lg:text-[12px] 2xl:text-[18px] xl:text-[16px] font-light text-[#808080]">Consumption</p>
          <p className="text-[15px] xs:text-md sm:text-[12px] lg:text-[14px] 2xl:text-[20px] xl:text-[17px] xxl:text-[18px] font-semibold">{fuel_consumption}L/100Km</p>
        </div>
      </div>
      <div className="w-full bg-white h-12 xl:h-16 p-2 xs:p-3 sm:p-2 md:p-1 lg:p-2 xl:p-3 pt-4 pb-4 rounded-md flex flex-row items-center justify-between">
        <p className="font-bold text-xl md:text-lg lg:text-3xl text-primary xl:text-[32px] 2xl:text-5xl xxl:text-4xl">
          <span className="sm:text-[8px] xl:text-[12px] 2xl:text-[16px] xxl:text-md text-xs sm:font-semibold">FROM </span>$370
          <span className="sm:text-[10px] xl:text-[14px] 2xl:text-[20px] xxl:text-[16px] text-xs">/week</span>
        </p>
        <button
          className="bg-primary text-white text-xs xl:text-md md:text-[9px] lg:text-xs rounded-md px-2 p-1 xs:px-3 xs:p-2 sm:p-1 pt-2 pb-2 sm:pl-3 sm:pr-3 xl:py-2 xl:px-3"
          onClick={onViewCalculation}
        >
          View Calculation
        </button>
      </div>
    </div>
  );
};

export default CarCard;
