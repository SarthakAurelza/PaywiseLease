const CarDetails = ({ car }) => (
  <div className='flex flex-row bg-gray-200 items-center justify-start p-1 xs:p-2 md:p-3 gap-3 rounded-lg lg:p-1 lg:pt-2 lg:pb-2 2xl:p-4 w-full'>
    <img
      src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
      alt={car.model}
      className="w-[130px] 3xl:w-[220px] h-full object-cover rounded-md bg-white"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/images/no-image.jpeg';
      }}
    />
    <p className="3xl:text-3xl 2xl:text-xl sm:text-lg xs:text-[16px] text-sm font-semibold text-primary">
      {car.brand.toUpperCase()} {car.model.toUpperCase()} <br />
      <span className='font-normal text-xs xs:text-sm lg:text-[13px] xl:text-lg 3xl:text-2xl'>
        {car.variant.split(" ").slice(-4).join(" ").toUpperCase()}
      </span>
    </p>
  </div>
);

export default CarDetails;
