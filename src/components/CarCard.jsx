import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToComparison, removeFromComparison, setQuoteData,setFetchingQuote } from "@/features/filtersSlice";
import useVehicleData from "../hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import { useState,useEffect } from "react";
import {motion} from "framer-motion"
import { buttons, grids, typography } from "./typography/typography";
import PriceLoader from "./Card_Components/PriceLoader";

const CarCard = ({
  id,
  brand,
  engine,
  model,
  body,
  transmission,
  fuel_consumption,
  seats,
  quoteData,
  yearGroup,
  variant,
  onViewCalculation,
  imageUrl,
}) => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars); 
  const selectedOption = useSelector((state)=>state.filters.selectedOption);
  const quoteTime = useSelector((state)=>state.filters.quoteTime);

  const isInComparison = comparisonCars.some((car) => car.id === id);

  const carfeatures = {
    'Engine' : engine,
    'Body/Seats': body,
    'Transmission': transmission,
    'Consumption': fuel_consumption
  }

  const { fetchVehicleData, loading, error } = useVehicleData();
  const {fetchQuoteData} = useQuoteData();

  const [ isFetchingQuote , setIsFetchingQuote ] = useState(false);

  return (
    <card className={typography.card.carCard}>
      <img className="w-full" src={selectedOption ==='know'? `https://liveimages.redbook.com.au/redbook/car/spec/${imageUrl}.jpg` : imageUrl} onError={(e) => {
        e.target.onerror = null; 
        e.target.src = '/images/no-image.jpeg'; 
      }}  alt="carImage" />

      <div className="w-full flex flex-row justify-between items-start">
        <div className="flex flex-wrap gap-1 w-[55%]">
          <h4 className={typography.heading.h4}>{brand.toUpperCase()}</h4>
          <h5 className={typography.heading.h5}>{model.toUpperCase()}</h5>
          <br/>
          {/* <h3 className="text-xs font-normal">{variant.toUpperCase()}</h3> */}
        </div>

        <Button
          className={isInComparison ? buttons.compare_active: buttons.compare_inactive}
          onClick={(e) => {
            e.stopPropagation(); 
            if (isInComparison) {
              dispatch(removeFromComparison(id)); 
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

      <section className={grids.carFeatureGrid}>
        {Object.entries(carfeatures).map(([key,value]) => (
          <div key={key}>
            <h6 className={typography.heading.h6}>{key}</h6>
            <p className="font-semibold text-sm">{value} {key==='Consumption' && 'L/Km'}</p>
          </div>
        ))}
      </section>

      {
        quoteData ? (
           <>
            <div className="w-full bg-primary h-12 xl:h-16 p-2 xs:p-3 sm:p-2 md:p-1 lg:p-2 xl:p-3 pt-4 pb-4 rounded-md flex flex-row items-center justify-between">
              <p className="font-bold text-xl md:text-lg lg:text-3xl text-primary xl:text-[32px] 2xl:text-5xl xxl:text-4xl text-white">
                <span className="sm:text-[8px] xl:text-[12px] 2xl:text-[16px] xxl:text-md 3xl:text-lg text-xs sm:font-semibold">FROM </span>{quoteData && (
                    quoteTime === 'Weekly' ? (
                      <span>${Math.round(quoteData?.periodicCalculations[0]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                    ) : quoteTime === 'Fortnightly' ? (
                      <span>${Math.round(quoteData?.periodicCalculations[2]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                    ) : quoteTime === 'Monthly' ? (
                      <span>${Math.round(quoteData?.periodicCalculations[1]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                    ) : <span>${Math.round(quoteData?.periodicCalculations[0]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                  )}
                <span className="sm:text-[10px] xl:text-[14px] 2xl:text-[20px] xxl:text-[16px] text-xs font-semibold">/{quoteTime.slice(0,-2)}</span>
              </p>
              <button
                className="bg-[#41b6e6] text-black font-semibold text-xs xl:text-md md:text-[9px] lg:text-xs rounded-md 3xl:rounded-lg px-2 p-1 xs:px-3 xs:p-2 sm:p-1 pt-2 pb-2 sm:pl-3 sm:pr-3 xl:py-2 xl:px-3 3xl:text-lg"
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
          <PriceLoader data={quoteData} />
        )
      }
    </card>
  );
};

export default CarCard;
