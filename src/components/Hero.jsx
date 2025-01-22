import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters } from '../features/filtersSlice';

const Hero = () => {
  const [selectedOption, setSelectedOption] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeButton, setActiveButton] = useState(null); // Track the active button

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [carNames, setCarNames] = useState([]); // New state for full car names

  // Handle filter changes
  const handleChange = (key, value) => {
    if (key === 'engine' && value === 'Petrol/Diesel') {
      dispatch(setFilter({ key, value: 'Petrol/Diesel' }));
    } else {
      dispatch(setFilter({ key, value }));
    }
  };

  // Reset all filters
  const handleReset = () => {
    dispatch(resetFilters());
    setModels([]); // Clear models when resetting
    setVariants([]); // Clear variants when resetting
  };

  // Fetch distinct brands from Supabase
  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('Car_Details')
      .select('brand', { distinct: true });
    if (error) console.error(error);
    else setBrands([...new Set(data.map((item) => item.brand))]); 
  };

  // Fetch distinct models based on selected brand
  const fetchModels = async (brand) => {
    const { data, error } = await supabase
      .from('Car_Details')
      .select('model', { distinct: true })
      .eq('brand', brand);
    if (error) console.error(error);
    else setModels([...new Set(data.map((item) => item.model))]);
  };

  // Fetch distinct variants based on selected brand and model
  const fetchVariants = async (brand, model) => {
    const { data, error } = await supabase
      .from('Car_Details')
      .select('variant', { distinct: true })
      .eq('brand', brand)
      .eq('model', model);
    if (error) console.error(error);
    else setVariants([...new Set(data.map((item) => item.variant))]);
  };

  
  const fetchCarNames = async () => {
    const { data, error } = await supabase
      .from('Car_Details')
      .select('brand, model, variant');
    if (error) console.error(error);
    else setCarNames(data); // Store full car details
  };

  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setSuggestions([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    // Filter suggestions based on full car names
    const filteredSuggestions = carNames.filter((car) =>
      `${car.brand} ${car.model} ${car.variant}`.toLowerCase().includes(lowerCaseQuery)
    );

    setSuggestions(filteredSuggestions);
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchCarNames(); 
  }, []);

  // Load brands dynamically when "I know the car" is selected
  useEffect(() => {
    if (selectedOption === 'know') {
      fetchBrands(); 
    }
  }, [selectedOption]);

  return (
    <div className="bg-primary p-4 sm:p-8 md:pt-10 md:pb-10 lg:pt-14 xl:pt-20 xs:p-8 md:p-5 lg:p-16 text-white flex flex-col sm:gap-6 xl:gap-8 2xl:gap-12 xxl:gap-16">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col items-center sm:items-center md:items-center justify-between md:gap-0 sm:gap-8">
        <div className="flex flex-col gap-4 xs:w-[395px] sm:w-[91%] md:w-[59%] lg:w-[522px] 2xl:w-[660px] xxl:w-[790px] md:items-start items-center">
          <h1 className="lg:text-5xl sm:text-[42px] xs:text-4xl text-2xl font-bold mb-2 md:text-4xl 2xl:text-6xl xxl:text-7xl md:text-start text-center ">Lease your car with us</h1>
          <p className="lg:text-lg sm:text-[14px] md:text-sm text-[13px] xxl:text-2xl 2xl:text-xl mb-4 md:text-start text-center md:w-[400px] lg:w-full sm:w-[420px] xs:w-[350px]">
            <span className="font-semibold">Did you know?</span> Electric/PHEV
            cars have additional tax benefits as some are paid in your pre-tax
            dollars.
          </p>
          <a href="#" className="text-secondary sm:text-lg text-[13px] 2xl:text-2xl xxl:text-3xl underline mb-4 block">
            Have questions? Get in touch.
          </a>
        </div>

        {/* Toggle Buttons */}
        <div className="flex sm:space-x-4 xxl:space-x-8 space-x-2 mb-8 bg-muted
        p-3 xs:p-4 sm:p-6 md:p-4 lg:p-6 2xl:p-8 rounded-lg md:w-[340px] lg:w-auto sm:w-[420px] xs:w-[300px] w-[260px] ">
          <button
            className={`sm:w-[200px] lg:w-48 2xl:w-60 xxl:w-[320px] flex-1 p-2 xs:p-4 lg:p-4 xxl:p-8 md:p-2 sm:p-6 rounded-md font-medium ${
              selectedOption === 'browse'
                ? 'bg-secondary text-[#013243]'
                : 'bg-white text-[#013243]'
            }`}
            onClick={() => {
              handleReset();
              setActiveButton(null);
              setSelectedOption('browse');
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 xxl:space-y-4 xs:text-md sm:text-lg md:text-[16px] lg:text-lg  2xl:text-2xl xxl:text-3xl text-xs">
              <img className='md:w-4 lg:w-6 2xl:w-10 xxl:w-12' src="/images/search-icon.png" alt="" />
              <span>I want to browse for cars</span>
            </div>
          </button>

          <button
            className={`flex-1 xs:p-4 sm:p-4 md:p-2 p-2 xxl:p-8 rounded-md font-medium ${
              selectedOption === 'know'
                ? 'bg-secondary text-[#013243]'
                : 'bg-white text-[#013243]'
            }`}
            onClick={() => {
              handleReset();
              setActiveButton(null);
              setSelectedOption('know');
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 xs:text-md sm:text-lg md:text-[16px] lg:text-lg 2xl:text-2xl xxl:text-3xl text-xs">
              <img className='md:w-4 lg:w-6 2xl:w-10 xxl:w-12' src="/images/car-icon.png" alt="" />
              <span>I know the car type</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      {selectedOption === 'browse' ? (
        <div className="p-4 xs:p-3 sm:p-4 md:py-5 md:p-5 2xl:p-8 xxl:py-10 rounded-xl bg-muted">
          <h2 className="sm:text-lg md:text-md lg:text-lg 2xl:text-xl xxl:text-2xl text-[16px] font-semibold mb-2">Select Preference</h2>
          <div className="flex flex-col sm:w-auto gap-3
          sm:gap-2 md:gap-3 xxl:gap-12 2xl:gap-8 xs:grid xs:grid-cols-3 lg:gap-6">
            <button
              onClick={() => {
                handleChange('engine', 'Petrol/Diesel');
                setActiveButton('Petrol/Diesel');
              }}
              className={` h-10 xs:h-7 sm:h-auto sm:text-md text-sm rounded-xl font-medium xxl:h-20 ${
                activeButton === 'Petrol/Diesel' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Petrol/Diesel' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <img className={`px-2 xxl:w-12 md:w-8 lg:w-10 sm:w-7 xs:w-7 w-9 ${
                    activeButton === 'Petrol/Diesel' ? '' : 'filter invert sepia saturate-[500%] hue-rotate-[180deg]'
                  }`} src="/images/petroldiesel.png" alt="" />
                </div>
                <span className={`px-4 lg:text-lg 2xl:text-xl xxl:text-2xl md:text-md xs:text-xs ${
                  activeButton === 'Petrol/Diesel' ? 'font-bold' : ''
                }`}>Petrol/Diesel</span>
              </div>
            </button>
            <button
              onClick={() => {
                handleChange('engine', 'Electric');
                setActiveButton('Electric');
              }}
              className={`h-10 xs:h-7 sm:h-auto sm:text-md text-sm rounded-xl font-medium xxl:h-20 ${
                activeButton === 'Electric' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Electric' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <img className={`px-2 xxl:w-12 md:w-8 sm:w-7 lg:w-10 xs:w-7 w-9 ${
                    activeButton === 'Electric' ? 'filter invert sepia saturate-[500%] hue-rotate-[180deg]' : ''
                  }`} src="/images/electric.png" alt="" />
                </div>
                <span className={`px-4  lg:text-lg 2xl:px-8 md:text-md xs:text-xs 2xl:text-xl xxl:text-2xl ${
                  activeButton === 'Electric' ? 'font-bold' : ''
                }`}>Electric</span>
              </div>
            </button>
            <button
              onClick={() => {
                handleChange('engine', 'Hybrid');
                setActiveButton('Hybrid');
              }}
              className={`h-10 xs:h-7 sm:h-8 md:h-10 lg:h-[54px] 2xl:h-16 xxl:h-20 sm:text-md text-sm rounded-xl font-medium ${
                activeButton === 'Hybrid' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Hybrid' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <img className={`px-2 xxl:w-12 md:w-8 sm:w-7 lg:w-10 xs:w-7 w-9 ${
                    activeButton === 'Hybrid' ? 'filter invert sepia saturate-[500%] hue-rotate-[180deg]' : ''
                  }`} src="/images/hybrid.png" alt="" />
                </div>
                <span className={`px-4 lg:text-lg 2xl:text-xl xxl:text-2xl md:text-md xs:text-xs ${
                  activeButton === 'Hybrid' ? 'font-bold' : ''
                }`}>Hybrid</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-muted p-5 2xl:p-8 xxl:p-12 rounded-md">
          <h2 className="lg:text-lg 2xl:text-xl xxl:text-2xl sm:font-bold mb-2">Search for Vehicles</h2>
          <div className="sm:grid sm:grid-cols-4 sm:gap-4 flex flex-col gap-5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="md:p-4 md:h-10 lg:h-auto p-2 sm:text-md 2xl:text-xl xxl:text-2xl text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black w-full"
              />
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-md mt-2 p-2 max-h-48 overflow-y-auto z-10 text-black">
                  {suggestions.map((car, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        const fullName = `${car.brand} ${car.model} ${car.variant}`;
                        setSearchQuery(fullName);
                        setSuggestions([]);

                        handleChange('brand', car.brand);
                        fetchModels(car.brand);
                        handleChange('model', car.model);
                        fetchVariants(car.brand, car.model);
                        handleChange('variant', car.variant);
                      }}
                    >
                      {`${car.brand} ${car.model} ${car.variant}`}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Dropdown */}
            <select
              className="sm:p-2 p-2 lg:text-lg md:text-md xxl:text-2xl 2xl:text-xl text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => {
                const selectedBrand = e.target.value;
                fetchModels(selectedBrand); // Load models dynamically
                handleChange('brand', selectedBrand);
                setVariants([]); // Clear variants when brand changes
              }}
            >
              <option className="text-black" value="">
                Brand
              </option>
              {brands.map((brand, index) => (
                <option className="text-black" key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Model Dropdown */}
            <select
              className="sm:p-2 p-2 lg:text-lg md:text-md xxl:text-2xl text-sm 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => {
                const selectedModel = e.target.value;
                fetchVariants(filters.brand, selectedModel); // Load variants dynamically
                handleChange('model', selectedModel);
              }}
            >
              <option className="text-black" value="">
                Model
              </option>
              {models.map((model, index) => (
                <option className="text-black" key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>

            {/* Variant Dropdown */}
            <select
              className="sm:p-2 p-2 lg:text-lg md:text-md xxl:text-2xl text-sm 2xl:text-xl border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
              onChange={(e) => handleChange('variant', e.target.value)}
            >
              <option className="text-black" value="">
                Variant
              </option>
              {variants.map((variant, index) => (
                <option className="text-black" key={index} value={variant}>
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
