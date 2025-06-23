import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilter,
  resetFilters,
  setSelectedOption,
} from '../features/filtersSlice';
import usefetchAllCars from '@/hooks/usefetchAllCars';

const Hero = () => {
  const dispatch = useDispatch();
  const selectedOption = useSelector((state) => state.filters.selectedOption);
  const filters = useSelector((state) => state.filters);

  const toggleIcons = {
  browse: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='w-4 lg:w-6 2xl:w-10 xxl:w-12'>
              <path d="M21.0002 21L16.6572 16.657M16.6572 16.657C17.4001 15.9141 17.9894 15.0322 18.3914 14.0615C18.7935 13.0909 19.0004 12.0506 19.0004 11C19.0004 9.94939 18.7935 8.90908 18.3914 7.93845C17.9894 6.96782 17.4001 6.08588 16.6572 5.34299C15.9143 4.6001 15.0324 4.01081 14.0618 3.60877C13.0911 3.20672 12.0508 2.99979 11.0002 2.99979C9.9496 2.99979 8.90929 3.20672 7.93866 3.60877C6.96803 4.01081 6.08609 4.6001 5.34321 5.34299C3.84288 6.84332 3 8.87821 3 11C3 13.1218 3.84288 15.1567 5.34321 16.657C6.84354 18.1573 8.87842 19.0002 11.0002 19.0002C13.122 19.0002 15.1569 18.1573 16.6572 16.657Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
  ),
  know: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='w-4 lg:w-6 2xl:w-10 xxl:w-12'>
              <path d="M22.0175 10.9969C21.6739 10.5408 20.3975 10.2267 19.8575 9.40594C19.3175 8.58516 18.8755 6.80766 17.5011 6.12469C16.1268 5.44172 13.4999 5.25 11.9999 5.25C10.4999 5.25 7.87488 5.4375 6.49863 6.12328C5.12238 6.80906 4.68223 8.58516 4.14223 9.40453C3.60223 10.2239 2.32582 10.5408 1.98223 10.9969C1.63863 11.453 1.39676 14.3363 1.54394 15.75C1.69113 17.1637 1.96582 18 1.96582 18H5.99707C6.65707 18 6.87176 17.752 8.22176 17.625C9.70301 17.4844 11.1561 17.4375 11.9999 17.4375C12.8436 17.4375 14.3436 17.4844 15.8239 17.625C17.1739 17.753 17.3957 18 18.0486 18H22.033C22.033 18 22.3077 17.1637 22.4549 15.75C22.6021 14.3363 22.3593 11.453 22.0175 10.9969ZM18.7499 18H21.3749V18.75H18.7499V18ZM2.62488 18H5.24988V18.75H2.62488V18Z" stroke="#003E51" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.0847 14.4919C16.8076 14.1717 15.9048 13.9045 14.7095 13.7255C13.5142 13.5464 13.0783 13.5 12.0095 13.5C10.9408 13.5 10.4547 13.5769 9.30903 13.7255C8.16341 13.8741 7.30325 14.1384 6.93434 14.4919C6.38075 15.0281 7.19169 15.63 7.82825 15.7031C8.44513 15.7734 9.67841 15.7477 12.0147 15.7477C14.3509 15.7477 15.5842 15.7734 16.2011 15.7031C16.8367 15.6258 17.5895 15.0656 17.0847 14.4919ZM20.23 11.393C20.2273 11.3557 20.2111 11.3208 20.1842 11.2948C20.1574 11.2689 20.122 11.2538 20.0847 11.2523C19.5311 11.2327 18.969 11.272 17.972 11.5659C17.4633 11.7145 16.9857 11.9536 16.562 12.2719C16.4551 12.3553 16.4931 12.5808 16.6272 12.6047C17.449 12.7011 18.2757 12.7496 19.1031 12.75C19.5995 12.75 20.1118 12.6094 20.207 12.1669C20.2555 11.9117 20.2633 11.6505 20.23 11.393ZM3.77028 11.393C3.77291 11.3557 3.7892 11.3208 3.81602 11.2948C3.84284 11.2689 3.8783 11.2538 3.91559 11.2523C4.46919 11.2327 5.03122 11.272 6.02825 11.5659C6.53691 11.7145 7.01458 11.9536 7.43825 12.2719C7.54513 12.3553 7.50716 12.5808 7.37309 12.6047C6.5513 12.7011 5.72459 12.7496 4.89716 12.75C4.40075 12.75 3.88841 12.6094 3.79325 12.1669C3.74473 11.9117 3.73698 11.6505 3.77028 11.393Z" fill="#003E51"/>
              <path d="M20.25 9H21M3 9H3.75M3.65625 9.89062C3.65625 9.89062 5.82891 9.32812 12 9.32812C18.1711 9.32812 20.3438 9.89062 20.3438 9.89062" stroke="#003E51" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
  ),
};


  const {
    cars,
    brands,
    refresh,
    loading,
  } = usefetchAllCars();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeButton, setActiveButton] = useState(null);

  const handleChange = useCallback(
    (key, value) => {
      dispatch(setFilter({ key, value }));
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
    setSearchQuery('');
    setSuggestions([]);
    setActiveButton(null);
  }, [dispatch]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) return setSuggestions([]);

    const lowerQuery = query.toLowerCase();
    const filtered = cars.filter((car) =>
      `${car.brand} ${car.model} ${car.variant}`.toLowerCase().includes(lowerQuery)
    );
    setSuggestions(filtered);
  };

  const handleSuggestionSelect = (car) => {
    const fullName = `${car.brand} ${car.model} ${car.variant}`;
    setSearchQuery(fullName);
    setSuggestions([]);
    handleChange('brand', car.brand);
    handleChange('model', car.model);
    handleChange('variant', car.variant);
  };

  const filteredModels = useMemo(() => {
    return filters.brand
      ? [...new Set(cars.filter((car) => car.brand === filters.brand).map((car) => car.model))]
      : [];
  }, [cars, filters.brand]);

  const filteredVariants = useMemo(() => {
    return filters.brand && filters.model
      ? [...new Set(
          cars.filter(
            (car) => car.brand === filters.brand && car.model === filters.model
          ).map((car) => car.variant)
        )]
      : [];
  }, [cars, filters.brand, filters.model]);

  useEffect(() => {
    if (selectedOption) refresh();
  }, [selectedOption]);

  return (
    <div className="bg-[#003e51] p-4 sm:p-8 md:pt-10 md:pb-10 lg:pt-14 xl:pt-20 xs:p-8 md:p-5 lg:p-16 text-white flex flex-col sm:gap-6 xl:gap-8 2xl:gap-12 xxl:gap-16 3xl:gap-20">
      <div className="flex md:flex-row flex-col items-center justify-between gap-8">
        <div className="flex flex-col gap-4 max-w-[1250px] text-center md:text-left">
          <h1 className="text-[#41b6e6] font-bold text-2xl xs:text-4xl sm:text-[42px] md:text-4xl lg:text-5xl 2xl:text-6xl xxl:text-7xl 3xl:text-8xl">
            Get on the Road to Great Savings
          </h1>
          <p className="text-white text-[13px] sm:text-[14px] md:text-sm lg:text-lg 2xl:text-xl xxl:text-2xl 3xl:text-3xl max-w-[860px]">
            Take advantage of our simple novated lease calculator to explore your potential savings and find the ideal vehicle for your needs.
          </p>
          <a href="#" className="text-[#41b6e6] underline sm:text-lg text-[13px] 2xl:text-2xl xxl:text-3xl 3xl:text-4xl">
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
          <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-6 2xl:gap-8 xxl:gap-12">
            {['Petrol/Diesel', 'Electric', 'Hybrid'].map((engine) => (
              <button
                key={engine}
                onClick={() => {
                  handleChange('engine', engine);
                  setActiveButton(engine);
                }}
                className={`rounded-xl font-medium h-10 sm:h-auto text-sm sm:text-md xxl:h-20 ${
                  activeButton === engine ? 'bg-primary text-white' : 'bg-white text-[#013243]'
                }`}
              >
                <span className="px-2 sm:px-4 2xl:text-xl 3xl:text-3xl xxl:text-2xl">
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="p-2 md:p-4 text-sm sm:text-md 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black w-full"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 bg-white text-black border rounded-md mt-2 max-h-48 overflow-y-auto">
                  {suggestions.map((car, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionSelect(car)}
                    >
                      {`${car.brand} ${car.model} ${car.variant}`}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              onChange={(e) => handleChange('model', e.target.value)}
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
