import React, { useState } from 'react';

const CalculationSide = ({ car, onClose }) => {
  const [activeButton, setActiveButton] = useState('Weekly');
  

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
    <div className="bg-white flex flex-col lg:p-4 lg:pt-12 lg:pb-12 p-4 w-full rounded-lg shadow-md lg:gap-4 2xl:gap-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold md:text-2xl lg:text-[30px] 2xl:text-3xl">Your Calculation</h2>
        <button onClick={onClose} className="rounded-full bg-gray-100 px-3 py-1 font-bold hover:bg-gray-200">X</button>
      </div>
      <div className="lg:mb-4 mb-1 xs:mb-2 flex flex-col gap-4">
        <div className='flex flex-row bg-gray-200 items-center justify-start p-1 xs:p-2 md:p-3 gap-3 rounded-lg lg:p-1 lg:pt-2 lg:pb-2 2xl:p-4'>
          <img
            src={car.imageUrl}
            alt={car.model}
            className="w-[130px] h-full object-cover rounded-md bg-white"
          />
          <p className="2xl:text-xl sm:text-lg xs:text-[16px] text-sm font-semibold text-primary">
            {car.brand.toUpperCase()} {car.model.toUpperCase()} <br /> <span className='font-normal text-xs xs:text-sm lg:text-[13px] xl:text-lg'>{car.variant.toUpperCase()}</span>
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-[#808080] text-xs sm:text-[12px] 2xl:text-[14px]">Engine</p>
            <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px]">{car.engine}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px]">Body/Seats</p>
            <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px]">{car.body} - {car.seats}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px]">Transmission</p>
            <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px]">{car.transmission}</p>
          </div>
          <div className="h-6 border-l border-gray-300"></div>
          <div>
            <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px]">Consumption</p>
            <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px]">{car.fuel_consumption}L/100Km</p>
          </div>
        </div>
      </div>
      <div className="lg:mb-4 mb-2 flex flex-col lg:gap-4">
        <h3 className="md:text-4xl lg:text-5xl xs:text-3xl text-xl text-[#00445B] font-semibold 2xl:text-6xl">$500<span className="text-xs xs:text-[16px] text-[#666666] 2xl:text-lg">/week</span></h3>
        <div className="flex justify-between">
          {['Weekly', 'Fortnightly', 'Monthly'].map((button) => (
            <button
              key={button}
              onClick={() => handleButtonClick(button)}
              className={`border text-[9px] xs:text-[11px] 2xl:text-[16px] px-3 xs:px-6 xs:py-2 p-1 rounded-lg font-semibold ${
                activeButton === button ? 'bg-[#41B6E7] text-white' : 'bg-white'
              }`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 lg:mb-6 mb-3">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E] font-semibold text-sm xs:text-md 2xl:text-xl">INCLUDED</h2>
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col md:gap-2 lg:gap-4 gap-1">
          <div className="flex justify-between">
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Fuel
            </p>
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Finance
            </p>
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Insurance
            </p>
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Maintenance
            </p>
          </div>
          <div className="flex justify-start gap-4">
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Tyres
            </p>
            <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px]">
              Registration & CTP
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:gap-5 gap-2">
        <div className="flex gap-4 items-center">
          <h2 className="text-[#1D5E5E] font-semibold text-sm xs:text-md 2xl:text-xl">SAVINGS</h2>
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col sm:gap-3 gap-1 w-full lg:mb-6 mb-3">
          <p className="w-full text-xs xs:text-[14px] 2xl:text-lg flex justify-between">
            GST <span className="text-[#666666]">$10,000</span>
          </p>
          <p className="w-full text-sm xs:text-[14px] flex justify-between 2xl:text-lg">
            Income Tax <span className="text-[#666666]">$20,000</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col md:gap-2 lg:gap-5">
        <div className="flex gap-4 items-center">
          <hr className="h-[1px] w-full" />
        </div>

        <div className="flex flex-col gap-3 w-full lg:mb-6 mb-2">
          <p className="w-full text-xs xs:text-[16px] flex justify-between font-semibold text-muted 2xl:text-xl">
            Total Amount <span className='text-black'>$30,000</span>
          </p>
        </div>
      </div>

      <button className="bg-[#F0EF4F] text-sm font-semibold sm:text-[18px] w-full py-4 2xl:py-4 2xl:text-2xl rounded">
        Request a Quote
      </button>
    </div>
  );
};

export default CalculationSide;
