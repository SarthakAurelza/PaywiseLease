import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromComparison, setQuoteForCar } from "@/features/filtersSlice";

import CompareModal from "@/components/comparison/CompareModal";
import { buttons, containers, typography } from "@/components/typography/typography";
import PriceLoader from "@/components/Card_Components/PriceLoader";
import SelectCarModal from "@/components/comparison/SelectCarModal";
import usefetchAllCars from "@/hooks/usefetchAllCars";
import useSearchSuggestions from "@/hooks/useSearchSuggestions";
import { addToComparison } from "@/features/filtersSlice";
import useVehicleData from "@/hooks/useVehicleData";
import useQuoteData from "@/hooks/useQuoteData";
import Info from "@/components/Info";
import Disclaimer from "@/components/Disclaimer";

const featureKeys = [
  {key:"fuelType",label:"Fuel Type"},
  { key: "body", label: "Body Type" },
  { key: "transmission", label: "Transmission" },
  {key:"powerPlant",label:"Engine"},
  { key: "price", label: "Price" },
];

const rawFeatureKeys = [
  {key: "inductionDescription",label:"Induction Description"},
  {key: "engineTypeDescription",label:"Engine Type Description"},
  {key: "fuelCombined",label:"Fuel Consumption"},
]

const leasePriceKeys = [
  {key: "weekly",label:"Weekly Lease"},
  {key: "fortnightly",label:"Fortnightly Lease"},
  {key: "monthly",label:"Monthly Lease"},
]

const CompareCars = () => {
  const dispatch = useDispatch();
  const comparisonCars = useSelector((state) => state.filters.comparisonCars);
  const totalSlots = 3
  const filters = useSelector((state) => state.filters);
  const quoteTime = filters.quoteTime
  console.log("cars to compare are: ",comparisonCars)
  const [isSelectCarModalOpen,setIsSelectCarModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
    <div className="w-full lg:p-20 p-4">
      <h1 className="text-3xl font-semibold mb-8">Compare Cars</h1>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 text-left bg-white shadow rounded-xl">
          <thead>
            <tr>
              <th className="p-4 border-b font-medium text-gray-700 bg-gray-100 align-top w-[15%]">
                Feature
              </th>
              {Array.from({ length: totalSlots }).map((_, index) => {
                const car = comparisonCars[index];
                console.log("car is: ",car)
                const leaseAmount = car ? car.leasePrices.weekly : null;
                console.log("the lease amount: ",leaseAmount)

                return (
                  <th key={index} className="p-0 border-b bg-gray-100 align-top h-[300px]">
                    <div className={`border ${typography.card.carCard}`}>
                      {car ? (
                        <>
                          <div className="relative w-full min-w-[280px]">
                            <img
                              src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/no-image.jpeg";
                              }}
                              alt={car.model}
                              className="w-full object-cover rounded-lg"
                            />
                            <button
                              className={`absolute top-2 right-2 ${buttons.roundButton}`}
                              onClick={() => dispatch(removeFromComparison(car.id))}
                            >
                              x
                            </button>
                          </div>

                          <div className="mt-3 w-full">
                            <h4 className={typography.heading.h4}>
                              {car.brand?.toUpperCase()} {car.model?.toUpperCase()}
                            </h4>
                            <p className="text-sm text-primary font-medium flex flex-wrap">
                              {car.variant || "Base Model"}
                            </p>
                          </div>

                          {leaseAmount ? (
                            <div className={containers.price_container}>
                              <p className={typography.content.price_content}>
                                <span className="text-[10px] md:text-[12px] font-light xl:text-md">
                                  FROM{" "}
                                </span>
                                <span className="flex flex-row items-center">
                                  <span className="text-xl md:text-2xl font-semibold">
                                    ${Math.round(leaseAmount)}
                                  </span>
                                  <span className="text-[12px] font-light xl:text-md sm:text-[14px] ml-1">
                                    /week
                                  </span>
                                </span>
                              </p>
                              <button className={buttons.view_calculation}>View Calculation</button>
                            </div>
                          ) : (
                            <PriceLoader />
                          )}
                        </>
                      ) : (
                        <div
                          className="w-full h-full flex flex-col justify-center items-center cursor-pointer min-h-[200px] min-w-[280px]"
                          onClick={() => setIsSelectCarModalOpen(true)}
                        >
                          <img
                            src="/images/carIcon.png"
                            alt="Select Car"
                            className="w-24 h-24 mb-4"
                          />
                          <span className="text-sm font-semibold text-primary">
                            Select Car
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {featureKeys.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600 border-b bg-gray-50">{label}</td>
                {Array.from({ length: totalSlots }).map((_, idx) => {
                  const car = comparisonCars[idx];
                  if(label==="Price"){
                    return <td key={idx} className="p-4 border-b align-top text-gray-800">
                      <span className="text-lg font-bold">$</span>{car?.[key] || "-"}
                    </td>
                  }
                  else {return (
                    <td key={idx} className="p-4 border-b align-top text-gray-800">
                      {car?.[key] || "-"}
                    </td>
                  );}
                })}
              </tr>
            ))}
            {rawFeatureKeys.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600 border-b bg-gray-50">{label}</td>
                {Array.from({ length: totalSlots }).map((_, idx) => {
                  const car = comparisonCars[idx];
                  if(label==="Fuel Consumption"){
                    return (
                    <td key={idx} className="p-4 border-b align-top text-gray-800">
                      {car?.raw?.[key] || "-"} L/Km
                    </td>
                  );
                  }else{
                    return (
                    <td key={idx} className="p-4 border-b align-top text-gray-800">
                      {car?.raw?.[key] || "-"}
                    </td>
                  );
                  }
                })}
              </tr>
            ))}
            {leasePriceKeys.map(({key,label}) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-600 border-b bg-gray-50">{label}</td>
                {Array.from({ length: totalSlots }).map((_, idx) => {
                  const car = comparisonCars[idx];
                    return (
                    <td key={idx} className="p-4 border-b align-top text-gray-800">
                      <span className="text-lg font-bold">$ </span>{car?.leasePrices?.[key] || "-"}/{key.slice(0,-2)}
                    </td>
                  );
                  
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Car Select Modal */}
      {isSelectCarModalOpen && (
        <SelectCarModal
        onClose={() => setIsSelectCarModalOpen(false)}
        />
      )}
    </div>

    <Disclaimer />
    <Info />
    </>

  );
};

export default CompareCars;
