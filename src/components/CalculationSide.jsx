import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { setQuoteTime } from '@/features/filtersSlice';
import CarDetails from './CarDetails';
import QuoteForm from './QuoteForm';
import QuoteButton from './QuoteButton';
import FeatureList from './FeatureList';
import Savings from './Savings';
import { SeparatorHorizontal } from 'lucide-react';

const CalculationSide = ({ car, onClose, quoteData }) => {
  const [activeButton, setActiveButton] = useState('Weekly');
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      ref_source_text: "Website Form Submission",
      comment: formData.get("comment") || "",
    };

    try {
      const response = await fetch("https://oneboard.fleetnetwork.com.au/api/v1/leads/wp", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_FORM_TOKEN}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Your quote request has been submitted successfully!");
        event.target.reset();
      } else {
        const errorData = await response.json();
        alert(`Submission failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting your request. Please try again later.");
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
    dispatch(setQuoteTime(button));
  };

  const getLeaseCost = () => {
    if (!quoteData || !quoteData.periodicCalculations) return;

    const costMap = {
      Weekly: quoteData.periodicCalculations[0]?.cost?.totalLeaseNet,
      Fortnightly: quoteData.periodicCalculations[2]?.cost?.totalLeaseNet,
      Monthly: quoteData.periodicCalculations[1]?.cost?.totalLeaseNet
    };
    return Math.round(costMap[activeButton]);
  };

  if (!car) {
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
    <div className="bg-white flex flex-col lg:p-4 lg:pt-12 lg:pb-12 p-2 sm:p-6 md:p-4 w-full rounded-lg shadow-md lg:gap-8 xl:gap-12 2xl:gap-16 3xl:gap-20 h-full lg:h-auto justify-between">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl md:text-2xl lg:text-[30px] 2xl:text-3xl 3xl:text-5xl">{showForm ? "Request a Quote" : "Your Calculation"}</h2>
        <button onClick={onClose} className="rounded-full bg-gray-100 px-3 py-1 font-bold hover:bg-gray-200">X</button>
      </div>

      {showForm ? (
        <QuoteForm handleSubmit={handleSubmit} />
      ) : (
        <>
          <CarDetails car={car} />
          <div className="lg:mb-4 mb-2 flex flex-col md:gap-4 gap-2 lg:gap-4 3xl:gap-8">
            <h3 className="md:text-4xl lg:text-5xl xs:text-3xl text-xl text-[#00445B] font-semibold max-w-full 2xl:text-6xl 3xl:text-7xl">
              ${getLeaseCost()}
              <span className="text-xs xs:text-[16px] text-[#666666] 2xl:text-lg 3xl:text-2xl">
                /{activeButton.toLowerCase().slice(0, -2)}
              </span>
            </h3>
            <QuoteButton activeButton={activeButton} handleButtonClick={handleButtonClick} />
          </div>

          <div className='flex items-center gap-6'>
            <p className='text-primary font-semibold'>INCLUDED</p>
            <hr className='w-full' />

          </div>
          
          <FeatureList features={["Fuel", "Finance", "Insurance", "Maintainence","Tyres","Registration & CTP"]} />
          <div className='flex items-center gap-6'>
            <p className='text-primary font-semibold'>SAVINGS</p>
            <hr className='w-full' />

          </div>
          <Savings />

          <div className='w-full flex items-center justify-between'>
            <p className='font-bold'>Total</p>
            <p className='font-bold'>$30,000</p>
          </div>
        </>
      )}

      {!showForm && (
        <button className="bg-[#F0EF4F] text-sm font-semibold sm:text-[18px] w-full py-3 md:py-4 2xl:py-4 3xl:py-6 2xl:text-2xl 3xl:text-4xl rounded" onClick={() => setShowForm(true)}>
          Request a Quote
        </button>
      )}
    </div>
  );
};

export default CalculationSide;