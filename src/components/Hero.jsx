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
    <div className="bg-primary p-4 pt-14 xs:p-8 sm:p-16 text-white flex flex-col sm:gap-6">
      {/* Header Section */}
      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div className="flex flex-col gap-4 sm:w-[522px]">
          <h1 className="sm:text-5xl xs:text-3xl text-2xl font-bold mb-2">Lease your car with us</h1>
          <p className="sm:text-lg text-[13px] mb-4">
            <span className="font-semibold">Did you know?</span> Electric/PHEV
            cars have additional tax benefits as some are paid in your pre-tax
            dollars.
          </p>
          <a href="#" className="text-secondary sm:text-lg text-[13px] underline mb-4 block">
            Have questions? Get in touch.
          </a>
        </div>

        {/* Toggle Buttons */}
        <div className="flex sm:space-x-4 space-x-2 mb-8 bg-muted p-6 rounded-lg w-full sm:w-auto">
          <button
            className={`sm:w-48 flex-1 sm:p-4 p-2 rounded-md font-medium ${
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
            <div className="flex flex-col items-center justify-center space-y-2 sm:text-xl text-xs">
              <img className='w-6' src="/images/search-icon.png" alt="" />
              <span>I want to browse for cars</span>
            </div>
          </button>

          <button
            className={`flex-1 sm:p-4 p-2 rounded-md font-medium ${
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
            <div className="flex flex-col items-center justify-center space-y-2 sm:text-xl text-xs">
              <img className='w-6' src="/images/car-icon.png" alt="" />
              <span>I know the car type</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      {selectedOption === 'browse' ? (
        <div className="p-5 rounded-xl bg-muted">
          <h2 className="sm:text-lg text-[16px] sm:font-semibold mb-2">Select Preference</h2>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-6">
            <button
              onClick={() => {
                handleChange('engine', 'Petrol/Diesel');
                setActiveButton('Petrol/Diesel');
              }}
              className={` sm:text-md text-sm rounded-xl font-medium ${
                activeButton === 'Petrol/Diesel' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Petrol/Diesel' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16'
                }`}>
                  <img className={`px-2 ${
                    activeButton === 'Petrol/Diesel' ? '' : 'filter invert sepia saturate-[500%] hue-rotate-[180deg]'
                  }`} src="/images/petroldiesel.png" alt="" />
                </div>
                <span className={`px-4 text-lg ${
                  activeButton === 'Petrol/Diesel' ? 'font-bold' : ''
                }`}>Petrol/Diesel</span>
              </div>
            </button>
            <button
              onClick={() => {
                handleChange('engine', 'Electric');
                setActiveButton('Electric');
              }}
              className={` sm:text-md text-sm rounded-xl font-medium ${
                activeButton === 'Electric' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Electric' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16'
                }`}>
                  <img className={`px-2 ${
                    activeButton === 'Electric' ? 'filter invert sepia saturate-[500%] hue-rotate-[180deg]' : ''
                  }`} src="/images/electric.png" alt="" />
                </div>
                <span className={`px-4 text-lg ${
                  activeButton === 'Electric' ? 'font-bold' : ''
                }`}>Electric</span>
              </div>
            </button>
            <button
              onClick={() => {
                handleChange('engine', 'Hybrid');
                setActiveButton('Hybrid');
              }}
              className={`h-[54px] sm:text-md text-sm rounded-xl font-medium ${
                activeButton === 'Hybrid' ? 'bg-secondary' : 'bg-white'
              } text-[#013243]`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Hybrid' ? 'bg-secondary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16' : 'bg-[#41B6E7] h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl w-16'
                }`}>
                  <img className={`px-2 ${
                    activeButton === 'Hybrid' ? 'filter invert sepia saturate-[500%] hue-rotate-[180deg]' : ''
                  }`} src="/images/hybrid.png" alt="" />
                </div>
                <span className={`px-4 text-lg ${
                  activeButton === 'Hybrid' ? 'font-bold' : ''
                }`}>Hybrid</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-muted p-5 rounded-md">
          <h2 className="sm:text-lg sm:font-bold mb-2">Search for Vehicles</h2>
          <div className="sm:grid sm:grid-cols-4 sm:gap-4 flex flex-col gap-5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="sm:p-4 p-2 sm:text-md text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black w-full"
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
              className="sm:p-2 p-2 sm:text-lg text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
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
              className="sm:p-2 p-2 sm:text-lg text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
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
              className="sm:p-2 p-2 sm:text-lg text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
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
