import React from 'react';

const CalculationSide = ({ car, onClose }) => {
  if (!car) {
    // If no car is passed, show a fallback UI
    return (
      <div className="bg-white sm:p-8 p-3 w-full rounded-lg shadow-md sm:gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="sm:text-xl font-semibold sm:text-[30px]">No Car Selected</h2>
          <button onClick={onClose} className="text-red-500 font-bold">X</button>
        </div>
        <p>Please select a car to view calculations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white sm:p-8 p-3 w-full rounded-lg shadow-md sm:gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="sm:text-xl font-semibold sm:text-[30px]">Your Calculation</h2>
        <button onClick={onClose} className="text-red-500 font-bold">X</button>
      </div>
      <div className="sm:mb-4 mb-2 flex flex-col gap-4">
        <div className='flex flex-row bg-gray-200 sm:h-[90px] items-center justify-around sm:p-3 rounded-lg'>
          <img
            src={car.imageUrl}
            alt={car.model}
            className="w-[132px] h-full object-cover rounded-md mb-2"
          />
          <p className="sm:text-lg sm:text-[20px] text-center">
            {car.brand} {car.model} <br /> {car.variant}
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-[#808080] text-[8px]">Engine</p>
            <p className="text-[12px]">{car.engine}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[8px] text-[#808080]">Body/Seats</p>
            <p className="text-[12px]">{car.body} - {car.seats}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[8px] text-[#808080]">Transmission</p>
            <p className="text-[12px]">{car.transmission}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[8px] text-[#808080]">Consumption</p>
            <p className="text-[12px]">{car.fuel_consumption}L/100Km</p>
          </div>
        </div>
      </div>
      <div className="sm:mb-4 mb-2 flex flex-col gap-4">
        <h3 className="sm:text-5xl text-3xl text-[#00445B]">$500/<span className="text-[16px]">week</span></h3>
        <div className="flex justify-between">
          <button className="bg-white border text-[11px] sm:pt-2 pr-6 sm:pb-2 pl-6 p-2 rounded">Weekly</button>
          <button className="bg-white border text-[11px] sm:pt-2 pr-6 sm:pb-2 pl-6 p-2 rounded">Fortnightly</button>
          <button className="bg-white border text-[11px] sm:pt-2 pr-6 sm:pb-2 pl-6 p-2 rounded">Monthly</button>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:mb-6 mb-3">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E]">INCLUDED</h2>
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col sm:gap-4 gap-1">
          <div className="flex justify-between">
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Fuel
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Finance
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Insurance
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Maintenance
            </p>
          </div>
          <div className="flex justify-start gap-4">
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Tyres
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border text-[12px] text-center text-[#00445B]">
              Registration & CTP
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:gap-5 gap-2">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E]">SAVINGS</h2>
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col sm:gap-3 gap-1 w-full sm:mb-6 mb-3">
          <p className="w-full text-[14px] flex justify-between">
            GST <span className="text-[#666666]">$10,000</span>
          </p>
          <p className="w-full text-[14px] flex justify-between">
            Income Tax <span className="text-[#666666]">$20,000</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex gap-4 items-center">
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col gap-3 w-full sm:mb-6 mb-2">
          <p className="w-full text-[14px] flex justify-between font-semibold">
            Total Amount <span>$30,000</span>
          </p>
        </div>
      </div>

      <button className="bg-[#F0EF4F] text-[18px] w-full py-2 rounded">
        Request a Quote
      </button>
    </div>
  );
};

export default CalculationSide;
