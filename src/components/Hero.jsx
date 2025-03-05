import React, { useEffect, useState } from 'react';
import supabase from '../supabase/supabaseClient';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, resetFilters, setSelectedOption } from '../features/filtersSlice';

const Hero = () => {
  const [Option, setOption] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeButton, setActiveButton] = useState(null); // Track the active button

  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const selectedOption = useSelector((state) => state.filters.selectedOption)

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
  const table = selectedOption === 'know' ? 'test_data_dump2': 'Car_Details'
  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from(table)
      .select('brand', { distinct: true });
    if (error) console.error(error);
    else setBrands([...new Set(data.map((item) => item.brand))]); 
  };

  // Fetch distinct models based on selected brand
  const fetchModels = async (brand) => {
    const { data, error } = await supabase
      .from(table)
      .select('model', { distinct: true })
      .eq('brand', brand);
    if (error) console.error(error);
    else setModels([...new Set(data.map((item) => item.model))]);
  };

  // Fetch distinct variants based on selected brand and model
  const fetchVariants = async (brand, model) => {
    const { data, error } = await supabase
      .from(table)
      .select('variant', { distinct: true })
      .eq('brand', brand)
      .eq('model', model);
    if (error) console.error(error);
    else setVariants([...new Set(data.map((item) => item.variant))]);
  };

  
  const fetchCarNames = async () => {
    const { data, error } = await supabase
      .from(table)
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
  }, [selectedOption]);

  // Load brands dynamically when "I know the car" is selected
  useEffect(() => {
    if (selectedOption === 'know') {
      fetchBrands(); 
    }
  }, [selectedOption]);

  return (
    <div className="bg-[#003e51] p-4 sm:p-8 md:pt-10 md:pb-10 lg:pt-14 xl:pt-20 xs:p-8 md:p-5 lg:p-16 text-white flex flex-col sm:gap-6 xl:gap-8 2xl:gap-12 xxl:gap-16 3xl:gap-20">
      {/* Header Section */}
      <div className="flex md:flex-row flex-col items-center sm:items-center md:items-center justify-between md:gap-0 sm:gap-8">
        <div className="flex flex-col gap-4 xs:w-[395px] sm:w-[91%] md:w-[59%] lg:w-[522px] 2xl:w-[660px] xxl:w-[790px] 3xl:w-[1050px] md:items-start items-center">
          <h1 className="lg:text-5xl sm:text-[42px] xs:text-4xl text-2xl font-bold mb-2 md:text-4xl 2xl:text-6xl xxl:text-7xl md:text-start text-center 3xl:text-8xl text-[#41b6e6]">Lease your car with us</h1>
          <p className="lg:text-lg sm:text-[14px] md:text-sm text-[13px] xxl:text-2xl 3xl:text-3xl 2xl:text-xl mb-4 md:text-start text-center md:w-[400px] lg:w-full sm:w-[420px] xs:w-[350px]">
            <span className="font-semibold font-Inter">Did you know?</span> Electric/PHEV
            cars have additional tax benefits as some are paid in your pre-tax
            dollars.
          </p>
          <a href="#" className="text-[#41b6e6] sm:text-lg text-[13px] 2xl:text-2xl xxl:text-3xl 3xl:text-4xl underline mb-4 block font-Inter">
            Have questions? Get in touch.
          </a>
        </div>

        {/* Toggle Buttons */}
        <div className="flex sm:space-x-4 xxl:space-x-8 space-x-2 mb-8 bg-muted
        p-3 xs:p-4 sm:p-6 md:p-4 lg:p-6 2xl:p-8 rounded-lg md:w-[340px] lg:w-auto sm:w-[420px] xs:w-[300px] w-[260px] ">
          <button
            className={`sm:w-[200px] lg:w-48 2xl:w-60 xxl:w-[320px] flex-1 p-2 xs:p-4 lg:p-4 xxl:p-8 md:p-2 sm:p-6 rounded-md font-medium ${
              selectedOption === 'browse'
                ? 'bg-[#41b6e6] text-[#013243]'
                : 'bg-white text-[#013243]'
            }`}
            onClick={() => {
              handleReset();
              setActiveButton(null);
              dispatch(setSelectedOption('browse'));
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 xxl:space-y-4 xs:text-md sm:text-lg md:text-[16px] lg:text-lg  2xl:text-2xl xxl:text-3xl text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='w-4 lg:w-6 2xl:w-10 xxl:w-12'>
              <path d="M21.0002 21L16.6572 16.657M16.6572 16.657C17.4001 15.9141 17.9894 15.0322 18.3914 14.0615C18.7935 13.0909 19.0004 12.0506 19.0004 11C19.0004 9.94939 18.7935 8.90908 18.3914 7.93845C17.9894 6.96782 17.4001 6.08588 16.6572 5.34299C15.9143 4.6001 15.0324 4.01081 14.0618 3.60877C13.0911 3.20672 12.0508 2.99979 11.0002 2.99979C9.9496 2.99979 8.90929 3.20672 7.93866 3.60877C6.96803 4.01081 6.08609 4.6001 5.34321 5.34299C3.84288 6.84332 3 8.87821 3 11C3 13.1218 3.84288 15.1567 5.34321 16.657C6.84354 18.1573 8.87842 19.0002 11.0002 19.0002C13.122 19.0002 15.1569 18.1573 16.6572 16.657Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>I want to browse for cars</span>
            </div>
          </button>

          <button
            className={`flex-1 xs:p-4 sm:p-4 md:p-2 p-2 xxl:p-8 rounded-md font-medium ${
              selectedOption === 'know'
                ? 'bg-[#41b6e6] text-[#013243]'
                : 'bg-white text-[#013243]'
            }`}
            onClick={() => {
              handleReset();
              setActiveButton(null);
              dispatch(setSelectedOption('know'));
            }}
          >
            <div className="flex flex-col items-center justify-center space-y-2 xs:text-md sm:text-lg md:text-[16px] lg:text-lg 2xl:text-2xl xxl:text-3xl text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className='w-4 lg:w-6 2xl:w-10 xxl:w-12'>
              <path d="M22.0175 10.9969C21.6739 10.5408 20.3975 10.2267 19.8575 9.40594C19.3175 8.58516 18.8755 6.80766 17.5011 6.12469C16.1268 5.44172 13.4999 5.25 11.9999 5.25C10.4999 5.25 7.87488 5.4375 6.49863 6.12328C5.12238 6.80906 4.68223 8.58516 4.14223 9.40453C3.60223 10.2239 2.32582 10.5408 1.98223 10.9969C1.63863 11.453 1.39676 14.3363 1.54394 15.75C1.69113 17.1637 1.96582 18 1.96582 18H5.99707C6.65707 18 6.87176 17.752 8.22176 17.625C9.70301 17.4844 11.1561 17.4375 11.9999 17.4375C12.8436 17.4375 14.3436 17.4844 15.8239 17.625C17.1739 17.753 17.3957 18 18.0486 18H22.033C22.033 18 22.3077 17.1637 22.4549 15.75C22.6021 14.3363 22.3593 11.453 22.0175 10.9969ZM18.7499 18H21.3749V18.75H18.7499V18ZM2.62488 18H5.24988V18.75H2.62488V18Z" stroke="#003E51" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17.0847 14.4919C16.8076 14.1717 15.9048 13.9045 14.7095 13.7255C13.5142 13.5464 13.0783 13.5 12.0095 13.5C10.9408 13.5 10.4547 13.5769 9.30903 13.7255C8.16341 13.8741 7.30325 14.1384 6.93434 14.4919C6.38075 15.0281 7.19169 15.63 7.82825 15.7031C8.44513 15.7734 9.67841 15.7477 12.0147 15.7477C14.3509 15.7477 15.5842 15.7734 16.2011 15.7031C16.8367 15.6258 17.5895 15.0656 17.0847 14.4919ZM20.23 11.393C20.2273 11.3557 20.2111 11.3208 20.1842 11.2948C20.1574 11.2689 20.122 11.2538 20.0847 11.2523C19.5311 11.2327 18.969 11.272 17.972 11.5659C17.4633 11.7145 16.9857 11.9536 16.562 12.2719C16.4551 12.3553 16.4931 12.5808 16.6272 12.6047C17.449 12.7011 18.2757 12.7496 19.1031 12.75C19.5995 12.75 20.1118 12.6094 20.207 12.1669C20.2555 11.9117 20.2633 11.6505 20.23 11.393ZM3.77028 11.393C3.77291 11.3557 3.7892 11.3208 3.81602 11.2948C3.84284 11.2689 3.8783 11.2538 3.91559 11.2523C4.46919 11.2327 5.03122 11.272 6.02825 11.5659C6.53691 11.7145 7.01458 11.9536 7.43825 12.2719C7.54513 12.3553 7.50716 12.5808 7.37309 12.6047C6.5513 12.7011 5.72459 12.7496 4.89716 12.75C4.40075 12.75 3.88841 12.6094 3.79325 12.1669C3.74473 11.9117 3.73698 11.6505 3.77028 11.393Z" fill="#003E51"/>
              <path d="M20.25 9H21M3 9H3.75M3.65625 9.89062C3.65625 9.89062 5.82891 9.32812 12 9.32812C18.1711 9.32812 20.3438 9.89062 20.3438 9.89062" stroke="#003E51" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>I know the car type</span>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      {selectedOption === 'browse' ? (
        <div className="p-4 xs:p-3 sm:p-4 md:py-5 md:p-5 2xl:p-8 xxl:py-10 3xl:py-12 rounded-xl bg-[#41b6e6]">
          <h2 className="sm:text-lg md:text-md lg:text-lg 2xl:text-xl xxl:text-2xl 3xl:text-3xl text-[16px] font-semibold mb-2 text-black">Select Preference</h2>
          <div className="flex flex-col sm:w-auto gap-3
          sm:gap-2 md:gap-3 xxl:gap-12 2xl:gap-8 xs:grid xs:grid-cols-3 lg:gap-6">
            <button
              onClick={() => {
                handleChange('engine', 'Petrol/Diesel');
                setActiveButton('Petrol/Diesel');
              }}
              className={` h-10 xs:h-7 sm:h-auto sm:text-md text-sm rounded-xl font-medium xxl:h-20 ${
                activeButton === 'Petrol/Diesel' ? 'bg-primary text-white' : 'bg-white text-[#013243]'
              }`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Petrol/Diesel' ? 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="26" viewBox="0 0 30 26" fill="none" className={`px-2 xxl:w-12 md:w-8 lg:w-10 sm:w-7 xs:w-7 w-9 ${
                    activeButton === 'Petrol/Diesel' ? 'filter invert sepia saturate-[500%] hue-rotate-[180deg]' : 'filter invert sepia saturate-[500%] hue-rotate-[180deg]'
                  }`}>
                    <path d="M1 7.72H17.7832M1 13.48H17.7832M17.7832 21.16H24.0769C25.1897 21.16 26.2569 20.7554 27.0438 20.0353C27.8307 19.3151 28.2727 18.3384 28.2727 17.32C28.2727 16.3016 27.8307 15.3249 27.0438 14.6047C26.2569 13.8846 25.1897 13.48 24.0769 13.48C23.5205 13.48 22.9869 13.2777 22.5935 12.9176C22.2 12.5576 21.979 12.0692 21.979 11.56V6.76L28.2727 1M1 5.8V23.08C1 23.5892 1.22103 24.0776 1.61446 24.4376C2.00789 24.7977 2.5415 25 3.0979 25H15.6853C16.2417 25 16.7753 24.7977 17.1688 24.4376C17.5622 24.0776 17.7832 23.5892 17.7832 23.08V5.8C17.7832 4.78157 17.3412 3.80485 16.5543 3.08471C15.7674 2.36457 14.7002 1.96 13.5874 1.96H5.1958C4.08301 1.96 3.01579 2.36457 2.22892 3.08471C1.44206 3.80485 1 4.78157 1 5.8Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21.9796 9.64017L26.1754 8.68017V2.92017M12.5391 18.2802V20.2002" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span className={`px-4 lg:text-lg 2xl:text-xl 3xl:text-3xl xxl:text-2xl md:text-md xs:text-xs ${
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
                activeButton === 'Electric' ? 'bg-primary text-white' : 'bg-white text-[#013243]'
              }`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Electric' ? 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`px-2 xxl:w-12 md:w-8 sm:w-7 lg:w-10 xs:w-7 w-9 ${
                    activeButton === 'Electric' ? '' : ''
                  }`}>
                    <path d="M5.481 21.174L8.1345 16.3275H6.549V12.5475L3.8655 17.394H5.481V21.174ZM1.5 9.75H10.5V2.424C10.5 2.193 10.404 1.981 10.212 1.788C10.02 1.595 9.8085 1.499 9.5775 1.5H2.4225C2.1925 1.5 1.981 1.596 1.788 1.788C1.595 1.98 1.499 2.192 1.5 2.424V9.75ZM1.5 22.5H10.5V11.25H1.5V22.5ZM0 24V2.424C0 1.733 0.2315 1.1565 0.6945 0.6945C1.1575 0.2325 1.734 0.001 2.424 0H9.5775C10.2675 0 10.844 0.2315 11.307 0.6945C11.77 1.1575 12.001 1.734 12 2.424V11.424H13.47C14.119 11.424 14.671 11.651 15.126 12.105C15.581 12.56 15.8085 13.1115 15.8085 13.7595V20.6685C15.8085 21.2085 16.0265 21.6775 16.4625 22.0755C16.8995 22.4745 17.3975 22.674 17.9565 22.674C18.5415 22.674 19.046 22.4745 19.47 22.0755C19.894 21.6775 20.106 21.2085 20.106 20.6685V7.3275H19.587C19.239 7.3275 18.95 7.2125 18.72 6.9825C18.49 6.7525 18.375 6.4635 18.375 6.1155V3.75H18.981V2.0775H20.1345V3.75H21.4035V2.0775H22.5585V3.75H23.163V6.1155C23.163 6.4635 23.048 6.7525 22.818 6.9825C22.588 7.2125 22.299 7.3275 21.951 7.3275H21.432V20.6685C21.432 21.5835 21.094 22.3675 20.418 23.0205C19.743 23.6735 18.923 24 17.958 24C17.017 24 16.202 23.6735 15.513 23.0205C14.825 22.3675 14.481 21.5835 14.481 20.6685V13.7595C14.481 13.4615 14.387 13.2185 14.199 13.0305C14.011 12.8425 13.7685 12.749 13.4715 12.75H12V24H0Z" fill="white"/>
                    </svg>
                </div>
                <span className={`px-4  lg:text-lg 2xl:px-8 md:text-md xs:text-xs 2xl:text-xl 3xl:text-3xl xxl:text-2xl ${
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
                activeButton === 'Hybrid' ? 'bg-primary text-white' : 'bg-white text-[#013243]'
              }`}
            >
              <div className={'flex items-center justify-start w-full h-full'}>
                <div className={`${
                  activeButton === 'Hybrid' ? 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20' : 'bg-primary h-full flex items-center justify-center rounded-bl-xl rounded-tl-xl lg:w-16 xxl:w-20'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="24" viewBox="0 0 19 24" fill="none" className={`px-2 xxl:w-12 md:w-8 sm:w-7 lg:w-10 xs:w-7 w-9 ${
                    activeButton === 'Electric' ? '' : ''
                  }`}>
                    <path d="M1.42926 13.944V15.687C1.42926 15.852 1.37387 15.9899 1.2631 16.1007C1.15232 16.2115 1.01443 16.2673 0.849424 16.268H0.581001C0.415997 16.268 0.278106 16.2123 0.167328 16.1007C0.0565509 15.9892 0.000774668 15.8513 0 15.687V7.15096L2.30658 0.581001C2.36313 0.39663 2.47197 0.253317 2.6331 0.15106C2.795 0.0503536 2.97511 0 3.17343 0H15.5081C15.6839 0 15.8439 0.0534521 15.988 0.160356C16.1321 0.267261 16.2316 0.407476 16.2866 0.581001L18.592 7.15096V15.687C18.592 15.852 18.5363 15.9899 18.4247 16.1007C18.3132 16.2115 18.1753 16.2673 18.011 16.268H17.7438C17.5788 16.268 17.4405 16.2123 17.3289 16.1007C17.2174 15.9892 17.1616 15.8513 17.1616 15.687V13.944H1.42926ZM1.6454 5.98896H16.9478L15.2362 1.162H3.35703L1.6454 5.98896ZM3.98334 11.2621C4.34434 11.2621 4.64956 11.1359 4.899 10.8833C5.14922 10.63 5.27433 10.3225 5.27433 9.96069C5.27433 9.59969 5.14767 9.29447 4.89435 9.04503C4.64104 8.79481 4.33388 8.6697 3.97289 8.6697C3.61112 8.6697 3.30512 8.79636 3.0549 9.04968C2.80624 9.30299 2.6819 9.61015 2.6819 9.97114C2.6819 10.3329 2.80817 10.6389 3.06071 10.8891C3.31403 11.1378 3.62235 11.2621 3.98334 11.2621ZM14.6203 11.2621C14.9813 11.2621 15.2865 11.1359 15.536 10.8833C15.7854 10.63 15.9101 10.3225 15.9101 9.96069C15.9101 9.59969 15.7839 9.29447 15.5313 9.04503C15.278 8.79481 14.9709 8.6697 14.6099 8.6697C14.2481 8.6697 13.9421 8.79636 13.6919 9.04968C13.4432 9.30299 13.3189 9.61015 13.3189 9.97114C13.3189 10.3329 13.4451 10.6389 13.6977 10.8891C13.951 11.1378 14.2585 11.2621 14.6203 11.2621ZM10.3023 24L4.35751 21.0055H8.29089V18.9953L14.2345 21.9886H10.3023V24ZM1.162 12.782H17.43V7.15096H1.162V12.782Z" fill="white"/>
                    </svg>
                </div>
                <span className={`px-4 lg:text-lg 2xl:text-xl xxl:text-2xl md:text-md 3xl:text-3xl xs:text-xs ${
                  activeButton === 'Hybrid' ? 'font-bold' : ''
                }`}>Hybrid</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#41b6e6] p-5 2xl:p-8 xxl:p-12 rounded-md">
          <h2 className="lg:text-lg 2xl:text-xl xxl:text-2xl 3xl:text-3xl sm:font-bold mb-2 text-black">Search for Vehicles</h2>
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
              className="sm:p-2 p-2 lg:text-lg md:text-md xxl:text-2xl 3xl:text-3xl 2xl:text-xl text-sm border border-gray-300 rounded-md focus:ring focus:outline-none text-black"
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
