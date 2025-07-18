import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilter,
  resetFilters,
  setSelectedOption,
} from '../../features/filtersSlice';
import useVehicleOptions from '@/hooks/useVehicleOptions';
import { typography } from '../typography/typography';
import { engineIcons, toggleIcons } from './hero_svgs';

const Hero = () => {
  const dispatch = useDispatch();
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const filters = useSelector((state) => state.filters);

  const { brands, models: filteredModels, variants: filteredVariants, loading } = useVehicleOptions();

  const [activeButton, setActiveButton] = useState(null);

  const handleChange = useCallback(
  (key, value) => {
    console.log(`handleChange called — key: ${key}, value: ${value}`);

    dispatch(setFilter({ key, value }));

    if (key === 'brand') {
      console.log('Brand changed — resetting model and variant');
      dispatch(setFilter({ key: 'model', value: '' }));
      dispatch(setFilter({ key: 'variant', value: '' }));
    } else if (key === 'model') {
      console.log('Model changed — resetting variant');
      dispatch(setFilter({ key: 'variant', value: '' }));
    }
  },
  [dispatch]
);

useEffect(() => {
  console.log("filters state: ",filters)
},[filters])


  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    setActiveButton(null);
  }, [dispatch]);

  return (
    <div className="bg-[#003e51] p-4 sm:p-8 md:pt-10 md:pb-10 lg:pt-14 xl:pt-20 xs:p-8 md:p-5 lg:p-16 text-white flex flex-col sm:gap-6 xl:gap-8 2xl:gap-12 xxl:gap-16 3xl:gap-20">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col items-center md:items-start sm:items-center justify-between md:gap-0 sm:gap-8">
        <div className="flex flex-col gap-4 xs:w-[395px] sm:w-[91%] md:w-[59%] lg:w-[722px] 2xl:w-[860px] xxl:w-[990px] 3xl:w-[1250px] md:items-start items-center">
          <h1 className={typography.heading.h1}>Get on the Road to Great Savings</h1>
          <p className="lg:text-lg sm:text-[14px] md:text-sm text-[13px] xxl:text-2xl 3xl:text-3xl 2xl:text-xl mb-4 md:text-start text-center md:w-[400px] lg:w-[90%] sm:w-[420px] xs:w-[350px]">
            Take advantage of our simple novated lease calculator to explore your potential savings and find the ideal vehicle for your needs. Whether you know exactly what you’re after or need some guidance, we’re got you covered.
          </p>
          <a href="#" className="text-[#41b6e6] sm:text-lg text-[13px] 2xl:text-2xl xxl:text-3xl 3xl:text-4xl underline mb-4 block font-Inter">
            Have questions? Get in touch.
          </a>
        </div>

        <div className="flex space-x-2 sm:space-x-4 xxl:space-x-8 bg-muted p-3 xs:p-4 sm:p-6 md:p-4 lg:p-6 2xl:p-8 rounded-lg">
          {['browse', 'know'].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                handleReset();
                dispatch(setSelectedOption(opt));
              }}
              className={`flex-1 p-2 xs:p-4 md:p-2 xxl:p-8 rounded-md font-medium ${
                selectedOption === opt ? 'bg-[#41b6e6] text-white' : 'bg-white text-[#013243]'
              }`}
            >
              <div className="flex flex-col items-center space-y-2 xxl:space-y-4 text-xs xs:text-md sm:text-lg md:text-[16px] lg:text-lg 2xl:text-2xl xxl:text-3xl">
                {toggleIcons[opt]}
                <span>
                  {opt === 'browse'
                    ? 'Find Your Ideal Vehicle'
                    : 'I Know the Make and Model'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedOption === 'browse' ? (
        <div className="p-4 xs:p-3 sm:p-4 md:py-5 md:p-5 2xl:p-8 xxl:py-10 3xl:py-12 rounded-xl bg-[#41b6e6]">
          <h2 className="text-white font-semibold mb-2 text-[16px] sm:text-lg md:text-md lg:text-lg 2xl:text-xl xxl:text-2xl 3xl:text-3xl">
            Select Preference
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-3 lg:gap-6 2xl:gap-8 xxl:gap-12">
            {['Petrol/Diesel', 'Electric', 'Hybrid'].map((engine) => (
              <button
                key={engine}
                onClick={() => {
                  handleChange('engineType', engine);
                  setActiveButton(engine);
                }}
                className={`rounded-xl font-medium flex items-center justify-start gap-5 px-2 py-4 transition-colors duration-200 ${
                  activeButton === engine ? 'bg-primary text-white' : 'bg-white text-[#013243]'
                }`}
              >
                <span className="w-6 h-6">
                  {engineIcons[engine](activeButton === engine)}
                </span>
                <span className="text-center text-sm">
                  {engine}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#41b6e6] p-5 2xl:p-8 xxl:p-12 rounded-md">
          <h2 className="text-white mb-2 font-bold text-sm sm:text-lg lg:text-lg 2xl:text-xl xxl:text-2xl 3xl:text-3xl">
            Search for Vehicles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <input className="p-2 sm:text-md lg:text-lg 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"/>
            <select
              className="p-2 sm:text-md lg:text-lg 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => handleChange('brand', e.target.value)}
              value={filters.brand || ''}
              disabled={loading}
            >
              <option value="">Brand</option>
              {brands.map((brand, i) => (
                <option key={i} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              className="p-2 sm:text-md lg:text-lg 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => {
                console.log('Model selected:', e.target.value);
                handleChange('model', e.target.value);
              }}
              value={filters.model || ''}
              disabled={!filters.brand}
            >
              <option value="">Model</option>
              {filteredModels.map((model, i) => (
                <option key={i} value={model}>
                  {model}
                </option>
              ))}
            </select>

            <select
              className="p-2 sm:text-md lg:text-lg 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => handleChange('variant', e.target.value)}
              value={filters.variant || ''}
              disabled={!filters.model}
            >
              <option value="">Variant</option>
              {filteredVariants.map((variant, i) => (
                <option key={i} value={variant}>
                  {variant}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
