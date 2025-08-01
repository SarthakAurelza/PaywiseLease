import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import useQuoteData from "@/hooks/useQuoteData";
import PriceLoader from "./PriceLoader";
import { buttons, containers, grids, typography } from "../typography/typography";
import { addToComparison, removeFromComparison, setFilter, updateComparisonLeasePrices } from "@/features/filtersSlice";


const CarCard = ({ car, onViewCalculation, onUpdateLeasePrices }) => {
  const dispatch = useDispatch();
  const quoteTime = "Weekly";
  const quoteRef = useRef({ carId: null });
  const userPreferences = useSelector((state) => state.filters.userPreferences);
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const [quote, setQuote] = useState(car.leasePrices || null);
  const initialPreferencesRef = useRef(userPreferences);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);

  const { fetchQuoteData } = useQuoteData();

  const isInComparison = Array.isArray(comparisonCars) && comparisonCars.some((c) => c.id === car.id);


  const carfeatures = {
    Engine: car.powerPlant,
    "Body/Seats": car.raw.bodyStyle || car.raw.bodyType,
    Transmission: car.gearTypeDescription || car.transmission,
    Consumption: `${car.raw.fuelCombined} L/Km`,
  };

  useEffect(() => {
    const current = userPreferences;

    const isValid =
      current?.state && current?.salary && current?.leaseTerm && current?.yearlyKm;

    if (!isValid) return;

    const fetchLeasePrice = async () => {
      const initial = initialPreferencesRef.current;

      const hasChanged =
        current?.state !== initial?.state ||
        current?.salary !== initial?.salary ||
        current?.leaseTerm !== initial?.leaseTerm ||
        current?.yearlyKm !== initial?.yearlyKm;

      if (!hasChanged && quoteRef.current.carId === car?.id) return;

      setIsFetchingQuote(true);

      const res = await fetchQuoteData(car.raw, {
        state: current.state,
        annualKms: current.yearlyKm,
        leaseTerm: current.leaseTerm,
        annualSalary: current.salary,
      });

        const leasePrices = {
          weekly: res.periodicCalculations.find(p => p.period === 'Weekly')?.cost?.budget?.budgetTotal || null,
          fortnightly: res.periodicCalculations.find(p => p.period === 'Fortnightly')?.cost?.budget?.budgetTotal || null,
          monthly: res.periodicCalculations.find(p => p.period === 'Monthly')?.cost?.budget?.budgetTotal || null,
        };

        console.log("THIS IS WHERE I SET THE LEASE PRICES: ",leasePrices, "for ",car.brand,car.model)

        setQuote(leasePrices);
        onUpdateLeasePrices(car.id, leasePrices);
        dispatch(updateComparisonLeasePrices({ carId: car.id, leasePrices }));
        quoteRef.current = { carId: car?.id };
        initialPreferencesRef.current = current;
      

      setIsFetchingQuote(false);
    };

    fetchLeasePrice();
  }, [userPreferences, car?.id]);
//   useEffect(() => {
//   if (car.leasePrices && typeof car.leasePrices === 'object' && Object.keys(car.leasePrices).length > 0) {
//     console.log("Car prop updated with lease prices:", car.brand, car.model, car.leasePrices);
//     setQuote(car.leasePrices);
//   }
// }, [car.leasePrices]);

  return (
    <div className={typography.card.carCard}>
      <img
        className="w-full"
        src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
        alt="carImage"
        onError={(e) => (e.currentTarget.src = "/images/no-image.jpeg")}
      />

      <div className="w-full flex justify-between items-start">
        <div className="flex flex-wrap gap-1 w-[55%]">
          <h4 className={typography.heading.h4}>{car.brand}</h4>
          <h5 className={typography.heading.h5}>{car.model}</h5>
        </div>

        <Button className={isInComparison ? buttons.compare_active : buttons.compare_inactive}
          onClick={()=>{
            if (isInComparison) {
              dispatch(removeFromComparison(car.id));
            } else {
              dispatch(addToComparison(car));
            }
          }}
        >
          {isInComparison ? "Remove" : "Add to compare"}
        </Button>
      </div>

      <section className={grids.carFeatureGrid}>
        {Object.entries(carfeatures).map(([key, value]) => (
          <div key={key}>
            <h6 className={typography.heading.h6}>{key}</h6>
            <p className="font-semibold text-sm xl:text-lg 2xl:text-xl">{value}</p>
          </div>
        ))}
      </section>

      {quote ? (
        <div className={containers.price_container}>
          <p className={typography.content.price_content}>
            <span className="text-[10px] md:text-[12px] font-light xl:text-md">FROM </span>
            <span className="flex items-center gap-1 text-xl md:text-2xl">
              {quote?.[quoteTime.toLowerCase()] ? `$${Math.round(quote[quoteTime.toLowerCase()])}` : "N/A"}
              <span className="text-[12px] font-light xl:text-md">/{quoteTime.slice(0, -2)}</span>
            </span>
          </p>
          <button className={buttons.view_calculation} onClick={onViewCalculation}>
            {"View Calculation"}
          </button>
        </div>
      ) : (
        <PriceLoader />
      )}
    </div>
  );
};

export default CarCard;
