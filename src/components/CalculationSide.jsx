import React, { useState } from 'react';

const CalculationSide = ({ car, onClose }) => {
  const [activeButton, setActiveButton] = useState('Weekly'); // Default active button

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  if (!car) {
    // If no car is passed, show a fallback UI
    return (
      <div className="bg-white sm:p-0 p-3 w-full rounded-lg shadow-md sm:gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="sm:text-xl font-semibold sm:text-[30px]">No Car Selected</h2>
          <button onClick={onClose} className="text-red-500 font-bold">X</button>
        </div>
        <p>Please select a car to view calculations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col sm:p-7 sm:pt-12 sm:pb-12 p-3 w-full rounded-lg shadow-md sm:gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold sm:text-[30px]">Your Calculation</h2>
        <button onClick={onClose} className="text-red-500 font-bold">X</button>
      </div>
      <div className="sm:mb-4 mb-2 flex flex-col gap-4">
        <div className='flex flex-row bg-gray-200 items-center justify-start gap-4 rounded-lg p-1 pt-2 pb-2'>
          <img
            src={car.imageUrl}
            alt={car.model}
            className="w-[130px] h-full object-cover rounded-md bg-white"
          />
          <p className="sm:text-lg sm:text-[15px] font-semibold text-primary">
            {car.brand.toUpperCase()} {car.model.toUpperCase()} <br /> <span className='font-normal text-[13px]'>{car.variant.toUpperCase()}</span>
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-[#808080] text-[12px]">Engine</p>
            <p className="text-[14px]">{car.engine}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[12px] text-[#808080]">Body/Seats</p>
            <p className="text-[14px]">{car.body} - {car.seats}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[12px] text-[#808080]">Transmission</p>
            <p className="text-[14px]">{car.transmission}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-[12px] text-[#808080]">Consumption</p>
            <p className="text-[14px]">{car.fuel_consumption}L/100Km</p>
          </div>
        </div>
      </div>
      <div className="sm:mb-4 mb-2 flex flex-col gap-4">
        <h3 className="sm:text-5xl text-3xl text-[#00445B] font-semibold">$500<span className="text-[16px] text-[#666666]">/week</span></h3>
        <div className="flex justify-between">
          {['Weekly', 'Fortnightly', 'Monthly'].map((button) => (
            <button
              key={button}
              onClick={() => handleButtonClick(button)}
              className={`border text-[11px] sm:pt-2 pr-6 sm:pb-2 pl-6 p-2 rounded-lg font-semibold ${
                activeButton === button ? 'bg-[#41B6E7] text-white' : 'bg-white'
              }`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:mb-6 mb-3">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E] font-semibold">INCLUDED</h2>
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col sm:gap-4 gap-1">
          <div className="flex justify-between">
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Fuel
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Finance
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Insurance
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Maintenance
            </p>
          </div>
          <div className="flex justify-start gap-4">
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Tyres
            </p>
            <p className="pt-[6px] pb-[6px] pl-[12px] pr-[12px] rounded border font-semibold text-[12px] text-center text-[#00445B]">
              Registration & CTP
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:gap-5 gap-2">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E] font-semibold">SAVINGS</h2>
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
          <p className="w-full text-[14px] flex justify-between font-semibold text-primary">
            Total Amount <span className='text-black'>$30,000</span>
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
