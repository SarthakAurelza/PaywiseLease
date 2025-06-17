import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserPreferences } from "@/features/filtersSlice";

const UserPreferences = () => {
  const dispatch = useDispatch();
  const { salary, leaseTerm, yearlyKm, state } = useSelector((state) => state.filters.userPreferences);

  const percentage_salary = ((salary - 20000) / (200000 - 20000)) * 100;
  const percentage_lease_term = ((leaseTerm - 1) / (5 - 1)) * 100;
  const percentage_yearly_km = ((yearlyKm - 5000) / (30000 - 5000)) * 100;

  const handleChange = (key, value) => {
    dispatch(setUserPreferences({ [key]: value }));
  };

  const stateOptions = ['NSW', 'VIC', 'WA', 'QLD', 'SA', 'TAS', 'ACT', 'NT'];

  return (
    <div className='w-full h-auto gap-3 grid justify-items-center xs:grid-cols-2 md:flex md:flex-row md:items-center md:justify-between lg:px-16 xs:px-6 px-4 pb-8'>

      {/* Salary */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2">
          Salary: <span className='font-light'>${salary.toLocaleString()}</span>
        </p>
        <input
          type="range"
          min="20000"
          max="200000"
          step="5000"
          value={salary}
          onChange={(e) => handleChange("salary", Number(e.target.value))}
          className="sm:w-[90%] w-full cursor-pointer appearance-none rounded-md h-2"
          style={{ background: `linear-gradient(to right, #4A90E2 ${percentage_salary}%, #ddd ${percentage_salary}%)` }}
        />
        <div className="sm:w-[90%] w-full flex justify-between text-xs md:text-sm text-gray-500 mt-2">
          <span>$20,000</span><span>$200,000</span>
        </div>
      </div>

      {/* Lease Term */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2">
          Lease Term <span className='font-light'>{leaseTerm} year</span>
        </p>
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={leaseTerm}
          onChange={(e) => handleChange("leaseTerm", Number(e.target.value))}
          className="sm:w-[90%] w-full cursor-pointer appearance-none rounded-md h-2"
          style={{ background: `linear-gradient(to right, #4A90E2 ${percentage_lease_term}%, #ddd ${percentage_lease_term}%)` }}
        />
        <div className="sm:w-[90%] w-full flex justify-between text-xs md:text-sm text-gray-500 mt-2">
          <span>1 year</span><span>5 years</span>
        </div>
      </div>

      {/* State */}
      <div className='w-full flex flex-col'>
        <p className='text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2'>State</p>
        <select
          className='rounded-md p-3 sm:p-1 md:p-2 lg:p-3 xs:p-2 xs:w-[100%] sm:w-[95%] lg:w-[90%]'
          value={state}
          onChange={(e) => handleChange("state", e.target.value)}
        >
          {stateOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Yearly KM */}
      <div className="w-full flex flex-col justify-between items-start">
        <p className="text-primary font-semibold text-sm lg:text-md xl:text-lg 2xl:text-xl pb-2">
          YearlyKm <span className='font-light'>{yearlyKm.toLocaleString()} Km</span>
        </p>
        <input
          type="range"
          min="5000"
          max="30000"
          step="5000"
          value={yearlyKm}
          onChange={(e) => handleChange("yearlyKm", Number(e.target.value))}
          className="sm:w-[90%] w-full cursor-pointer appearance-none rounded-md h-2"
          style={{ background: `linear-gradient(to right, #4A90E2 ${percentage_yearly_km}%, #ddd ${percentage_yearly_km}%)` }}
        />
        <div className="sm:w-[90%] w-full flex justify-between text-xs md:text-sm text-gray-500 mt-2">
          <span>5,000 Km</span><span>30,000 Km</span>
        </div>
      </div>

    </div>
  );
};

export default UserPreferences;
