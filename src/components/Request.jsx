import React from 'react';

const Request = () => {
  return (
    <div className="w-full p-16">
      <div className="bg-primary rounded-tl-xl rounded-tr-xl w-full h-full flex items-center justify-between p-8 overflow-hidden">
        {/* Text Content */}
        <div className="w-[60%] flex flex-col items-start gap-16 z-10">
          <div className="flex flex-col gap-8">
            <h2 className="text-white text-4xl md:text-5xl font-bold">Lease your car today</h2>
            <p className="text-lg md:text-xl text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.
            </p>
          </div>
          <button className="bg-secondary px-[30px] py-[12px] rounded-3xl text-xl font-semibold">
            Request a quote
          </button>
        </div>

        {/* Image Section */}
        <div className="flex items-end w-[60%] h-full">
          <img
            className="scale-[1.8] translate-y-[-15%] -translate-x-[10%]"
            src="/images/banner.png"
            alt="Car banner"
          />
        </div>
      </div>
    </div>
  );
};

export default Request;
