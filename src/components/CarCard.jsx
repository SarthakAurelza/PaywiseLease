import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addToComparison, removeFromComparison, setQuoteData,setFetchingQuote } from "@/features/filtersSlice";
import useVehicleData from "../hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import { useState,useEffect } from "react";
import {motion} from "framer-motion"
import { buttons, containers, grids, typography } from "./typography/typography";
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
  alignmentClass
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
    <card className={`${typography.card.carCard} ${alignmentClass}`}>
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
            <p className="font-semibold text-sm xl:text-lg 2xl:text-xl">{value} {key==='Consumption' && 'L/Km'}</p>
          </div>
        ))}
      </section>

      {
        quoteData ? (
           <>
            <div className={containers.price_container}>
              <p className={typography.content.price_content}>
                <span className="text-[10px] md:text-[12px] font-light xl:text-md">FROM </span>
                <span className="flex flex-row items-center">
                    <span className="text-xl md:text-2xl">
                      {quoteData && (
                      quoteTime === 'Weekly' ? (
                        <span>${Math.round(quoteData?.periodicCalculations[0]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                      ) : quoteTime === 'Fortnightly' ? (
                        <span>${Math.round(quoteData?.periodicCalculations[2]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                      ) : quoteTime === 'Monthly' ? (
                        <span>${Math.round(quoteData?.periodicCalculations[1]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                      ) : <span>${Math.round(quoteData?.periodicCalculations[0]?.cost?.totalLeaseNet ?? 'N/A')}</span>
                    )}
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
          <PriceLoader data={quoteData} />
        )
      }
    </card>
  );
};

export default CarCard;
