const CarDetails = ({ car }) => (
  <div className='flex flex-row bg-gray-200 items-center justify-start px-2 py-2 gap-3 rounded-lg w-full'>
    <img
      src={`https://liveimages.redbook.com.au/redbook/car/spec/${car.imageUrl}.jpg`}
      alt={car.model}
      className="w-[35%] h-full object-cover rounded-md bg-white"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/images/no-image.jpeg';
      }}
    />
    <div className="flex flex-wrap">
      <p className="3xl:text-3xl 2xl:text-xl sm:text-lg xs:text-[16px] text-sm font-semibold text-primary">
      {car.brand} <br/> {car.model} <br />
      <span className='font-normal text-sm'>
        {car.variant.split(" ").slice(0,3).join(" ").toUpperCase()}
      </span>
    </p>
    </div>
  </div>
);

export default CarDetails;
