import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from "framer-motion";
import { setQuoteTime } from '@/features/filtersSlice';


const CalculationSide = ({ car, onClose, quoteData }) => {
  const [activeButton, setActiveButton] = useState('Weekly');
  const [displayQuote, setDisplayQuote] = useState(null);
  const dispatch = useDispatch();


const handleSubmit = async (event) => {
  event.preventDefault(); // Prevent default form submission

  const formData = new FormData(event.target);

  // Create JSON object from form data
  const data = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    ref_source_text: "Website Form Submission", // Static reference text
    comment: formData.get("comment") || "", // Optional comment field
  };

  try {
    const response = await fetch("https://oneboard.fleetnetwork.com.au/api/v1/leads/wp", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_FORM_TOKEN}`, // Replace with your actual API token
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Your quote request has been submitted successfully!");
      event.target.reset(); // Reset the form
    } else {
      const errorData = await response.json();
      alert(`Submission failed: ${errorData.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred while submitting your request. Please try again later.");
  }
};

  
  
  const isFetchingQuote = useSelector((state) => state.filters.isFetchingQuote);
  const [showForm,setShowForm] = useState(false);

  const features1 = ["Fuel","Finance","Insurance","Maintainence"];
  const features2 = ["Tyres","Registration & CTP"];

  const handleButtonClick = (button) => {
    setActiveButton(button);
    dispatch(setQuoteTime(button));
  };
  useEffect(() => {
    console.log("Updated Quote Data:", quoteData);
    setDisplayQuote(quoteData); // Make sure displayQuote is updated
  }, [quoteData]);

  useEffect(() => {
    console.log("ShowForm updated:", showForm);
  }, [showForm]);
  

  const getLeaseCost = () => {
    if(!quoteData || !quoteData.periodicCalculations) return;

    const costMap = {
      Weekly: quoteData.periodicCalculations[0]?.cost?.totalLeaseNet,
      Fortnightly: quoteData.periodicCalculations[2]?.cost?.totalLeaseNet,
      Monthly: quoteData.periodicCalculations[1]?.cost?.totalLeaseNet
    }
    return Math.round(costMap[activeButton]);
  }

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
    <div className="bg-white flex flex-col lg:p-4 lg:pt-12 lg:pb-12 p-2 sm:p-6 md:p-4 w-full rounded-lg shadow-md lg:gap-4 2xl:gap-8 3xl:gap-16 h-full lg:h-auto justify-between">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl md:text-2xl lg:text-[30px] 2xl:text-3xl 3xl:text-5xl">{showForm ? "Request a Quote" : "Your Calculation"}</h2>
      
        <button onClick={onClose} className="rounded-full bg-gray-100 px-3 py-1 font-bold hover:bg-gray-200">X</button>
      </div>
      
      {
        showForm ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-auto justify-between items-start"
            >
            <div className='flex flex-row bg-gray-200 items-center justify-start p-1 xs:p-2 md:p-3 gap-3 rounded-lg lg:p-1 lg:pt-2 lg:pb-2 2xl:p-4 w-full'>
                    <img
                      src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                      alt={car.model}
                      className="w-[130px] 3xl:w-[220px] h-full object-cover rounded-md bg-white"
                    />
                    <p className="3xl:text-3xl 2xl:text-xl sm:text-lg xs:text-[16px] text-sm font-semibold text-primary">
                      {car.brand.toUpperCase()} {car.model.toUpperCase()} <br /> <span className='font-normal text-xs xs:text-sm lg:text-[13px] xl:text-lg 3xl:text-2xl'>{car.variant.split(" ").slice(-4).join(" ").toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <button 
                    className="text-primary font-semibold my-6 text-xl flex items-center gap-2" 
                    onClick={() => setShowForm(false)}
                  >
                    ⬅ Back
                  </button>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input type="text" name="first_name" className="border p-2 rounded-md w-full border-primary" placeholder="First Name*" required />

                    <input type="text" name="last_name" className="border p-2 rounded-md w-full border-primary" placeholder="Last Name*" required />

                    <input type="email" name="email" className="border p-2 rounded-md w-full border-primary" placeholder="Enter your email" required />

                    <input type="tel" name="phone" className="border p-2 rounded-md w-full border-primary" placeholder="Enter your phone number" required />

                    <textarea name="comment" className="border p-2 rounded-md w-full h-24 border-primary" placeholder="Any additional requests"></textarea>

                    <button type="submit" className="bg-muted text-white p-3 rounded-md text-lg font-semibold mt-4">Submit Quote Request</button>

                    <p>By clicking "submit", you acknowledge our Privacy Policy which contains a description of how we use your personal information.</p>
                  </form>

        </motion.div>
          </>
        ) : (
          <>
              <>
                    <div className="lg:mb-4 mb-1 xs:mb-2 flex flex-col gap-4">
                <div className='flex flex-row bg-gray-200 items-center justify-start p-1 xs:p-2 md:p-3 gap-3 rounded-lg lg:p-1 lg:pt-2 lg:pb-2 2xl:p-4'>
                  <img
                    src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
                    alt={car.model}
                    className="w-[130px] 3xl:w-[220px] h-full object-cover rounded-md bg-white"
                  />
                  <p className="3xl:text-3xl 2xl:text-xl sm:text-lg xs:text-[16px] lg:text-xl text-sm font-semibold text-primary ">
                    {car.brand.toUpperCase()} {car.model.toUpperCase()} <br /> <span className='font-normal text-xs xs:text-sm lg:text-[13px] xl:text-lg 3xl:text-2xl'>{car.variant.split(" ").slice(-4).join(" ").toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-[#808080] text-xs sm:text-[12px] 2xl:text-[14px] 3xl:text-lg">Engine</p>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px] 3xl:text-xl">{car.engine}</p>
                  </div>
                  <div className="h-6 3xl:h-10 border-l border-gray-300"></div>
                  <div>
                    <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px] 3xl:text-lg">Body/Seats</p>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px] 3xl:text-xl">{car.body} - {car.seats}</p>
                  </div>
                  <div className="h-6 border-l 3xl:h-10 border-gray-300"></div>
                  <div>
                    <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px] 3xl:text-lg">Transmission</p>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px] 3xl:text-xl">{car.transmission}</p>
                  </div>
                  <div className="h-6 border-l 3xl:h-10 border-gray-300"></div>
                  <div>
                    <p className="text-xs sm:text-[12px] text-[#808080] 2xl:text-[14px] 3xl:text-lg">Consumption</p>
                    <p className="text-[13px] sm:text-[14px] font-semibold text-primary 2xl:text-[16px] 3xl:text-xl">{car.fuel_consumption}L/100Km</p>
                  </div>
                </div>
              </div>
              <div className="lg:mb-4 mb-2 flex flex-col md:gap-4 gap-2 lg:gap-4 3xl:gap-8">
                <h3 className="md:text-4xl lg:text-5xl xs:text-3xl text-xl text-[#00445B] font-semibold 2xl:text-6xl 3xl:text-7xl">${getLeaseCost()}<span className="text-xs xs:text-[16px] text-[#666666] 2xl:text-lg 3xl:text-2xl">/{activeButton.toLowerCase().slice(0,-2)}</span></h3>
                <div className="flex justify-between">
                  {['Weekly', 'Fortnightly', 'Monthly'].map((button) => (
                    <button
                      key={button}
                      onClick={() => handleButtonClick(button)}
                      className={`border text-[9px] xs:text-[11px] md:text-[14px] 2xl:text-[16px] 3xl:text-xl px-3 xs:px-6 xs:py-2 p-1 rounded-lg font-semibold ${
                        activeButton === button ? 'bg-[#41b6e6] text-black' : 'bg-white'
                      }`}
                    >
                      {button}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:mb-6 mb-3">
                <div className="flex gap-4 items-center">
                  <h2 className="text-[#1D5E5E] font-semibold text-sm xs:text-md 2xl:text-xl 3xl:text-3xl">INCLUDED</h2>
                  <hr className="h-[1px] w-full" />
                </div>

                <div className="flex flex-col md:gap-2 lg:gap-4 gap-1">
                  <div className="flex justify-between">
                    {
                      features1.map((feature)=>(
                        <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px] 3xl:text-xl">
                          {feature}
                        </p>
                      ))
                    }
                  </div>
                  <div className="flex justify-start gap-4 xl:gap-6 xxl:gap-8">
                    {
                      features2.map((feature)=>(
                        <p className="xs:py-[6px] py-1 px-[5px] xs:px-[12px] rounded border font-semibold text-[11px] xs:text-[12px] text-center text-[#00445B] 2xl:text-[16px] 3xl:text-xl">
                          {feature}
                        </p>
                      ))
                    }
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:gap-5 gap-2">
                <div className="flex gap-4 items-center">
                  <h2 className="text-[#1D5E5E] font-semibold text-sm xs:text-md 2xl:text-xl 3xl:text-3xl">SAVINGS</h2>
                  <hr className="h-[1px] w-full" />
                </div>

                <div className="flex flex-col sm:gap-3 gap-1 w-full lg:mb-6 mb-3">
                  <p className="w-full text-xs xs:text-[14px] 2xl:text-lg flex justify-between 3xl:text-2xl">
                    GST <span className="text-[#666666]">$10,000</span>
                  </p>
                  <p className="w-full text-sm xs:text-[14px] flex justify-between 2xl:text-lg 3xl:text-2xl">
                    Income Tax <span className="text-[#666666]">$20,000</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:gap-2 lg:gap-5">
                <div className="flex gap-4 items-center">
                  <hr className="h-[1px] w-full" />
                </div>

                <div className="flex flex-col gap-3 w-full lg:mb-6 mb-2">
                  <p className="w-full text-[14px] xs:text-[16px] flex justify-between font-semibold text-muted 2xl:text-xl 3xl:text-3xl">
                    Total Amount <span className='text-black'>$30,000</span>
                  </p>
                </div>
              </div>
                  </>
          </>
        )
      }

      {
        !showForm && (
          <button className="bg-[#F0EF4F] text-sm font-semibold sm:text-[18px] w-full py-3 md:py-4 2xl:py-4 3xl:py-6 2xl:text-2xl 3xl:text-4xl rounded" onClick={ () =>     {setShowForm(true);}}>
            Request a Quote
          </button>
        )
      }
    </div>
  );
};

export default CalculationSide;
