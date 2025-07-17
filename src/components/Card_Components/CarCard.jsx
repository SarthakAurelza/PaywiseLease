import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToComparison, removeFromComparison, setQuoteData,setFetchingQuote } from "@/features/filtersSlice";
import useVehicleData from "@/hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import { useState,useEffect } from "react";
import {motion} from "framer-motion"
import { buttons, containers, grids, typography } from "../typography/typography"
import PriceLoader from "./PriceLoader";

const CarCard = ({
  car,
  price,
  onViewCalculation,
}) => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars); 
  const selectedOption = useSelector((state)=>state.filters.selectedOption);
  const quoteTime = 'Weekly'

  const isInComparison = comparisonCars.some((car) => car.id === id);

  const carfeatures = {
    'Engine' : car.engineDescription || car.engineType,
    'Body/Seats': car.bodyStyle || car.bodyType,
    'Transmission': car.gearTypeDescription || car.transmission,
    'Consumption': car.fuelType
  }

  const { fetchVehicleData, loading, error } = useVehicleData();
  const {fetchQuoteData} = useQuoteData();

  const [ isFetchingQuote , setIsFetchingQuote ] = useState(false);

  return (
    <card className={`${typography.card.carCard}`}>
      <img className="w-full" src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageCode}.jpg`} onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/images/no-image.jpeg'; 
      }}  alt="carImage" />

      <div className="w-full flex flex-row justify-between items-start">
        <div className="flex flex-wrap gap-1 w-[55%]">
          <h4 className={typography.heading.h4}>{car.make.toUpperCase()}</h4>
          <h5 className={typography.heading.h5}>{car.model.toUpperCase()}</h5>
          <br/>
          {/* <h3 className="text-xs font-normal">{variant.toUpperCase()}</h3> */}
        </div>

        <Button
          className={isInComparison ? buttons.compare_active: buttons.compare_inactive}
          // onClick={(e) => {
          //   e.stopPropagation(); 
          //   if (isInComparison) {
          //     dispatch(removeFromComparison(id)); 
          //   } else {
          //     dispatch(
          //       addToComparison({
          //         id,
          //         brand,
          //         engine,
          //         model,
          //         body,
          //         seats,
          //         variant,
          //         transmission,
          //         fuel_consumption,
          //         imageUrl, 
                  
          //       })
          //     )
          //   }
          // }}
        >
          {isInComparison ? "Remove" : "Add to compare"}
        </Button>
      </div>

      <section className={grids.carFeatureGrid}>
        {Object.entries(carfeatures).map(([key,value]) => (
          <div key={key}>
            <h6 className={typography.heading.h6}>{key}</h6>
            <p className="font-semibold text-sm xl:text-lg 2xl:text-xl">{value} {key==='Consumption' && 'L/Km'}</p>
          </div>
        ))}
      </section>

      {
        price ? (
           <>
            <div className={containers.price_container}>
              <p className={typography.content.price_content}>
                <span className="text-[10px] md:text-[12px] font-light xl:text-md">FROM </span>
                <span className="flex flex-row items-center">
                    <span className="text-xl md:text-2xl">
                      {
                        price ? (
                          <span>
                            {quoteTime === 'Weekly' && typeof price.weekly === 'number'
                              ? `$${Math.round(price.weekly)}`
                              : quoteTime === 'Fortnightly' && typeof price.fortnightly === 'number'
                              ? `$${Math.round(price.fortnightly)}`
                              : quoteTime === 'Monthly' && typeof price.monthly === 'number'
                              ? `$${Math.round(price.monthly)}`
                              : 'N/A'
                            }
                          </span>
                        ) : null
                      }
                    </span>
                  <span className="text-[12px] font-light xl:text-md sm:text-[14px]">/{quoteTime.slice(0,-2)}</span>
                </span>
              </p>
              <button
                className={buttons.view_calculation}
                onClick={async (e) => {
                  e.stopPropagation(); 
                  onViewCalculation();
                }}   
              >
                {isFetchingQuote ? "Loading..." : "View Calculation"}
              </button>
            </div>
          </>
        ) : (
          <PriceLoader data={price} />
        )
      }
    </card>
  );
};

export default CarCard;
