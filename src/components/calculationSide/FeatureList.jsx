const FeatureList = ({ features }) => {
  // Split the features into two rows: 4 items in the first row, 2 in the second
  const firstRowItems = features.slice(0, 4);
  const secondRowItems = features.slice(4);

  return (
    <div className="flex flex-col gap-4">
      {/* First row: 4 items with widths based on their text length, evenly spaced */}
      <div className="flex flex-wrap justify-between w-full">
        {firstRowItems.map((feature, index) => (
          <div
            key={index}
            className="py-1 px-3 rounded border font-semibold text-[#00445B] text-sm xs:text-[14px] 2xl:text-lg 3xl:text-xl text-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            {feature}
          </div>
        ))}
      </div>

      {/* Second row: 2 items with widths based on their text length */}
      <div className="flex flex-wrap gap-6">
        {secondRowItems.map((feature, index) => (
          <div
            key={index}
            className="py-1 px-3 rounded border font-semibold text-[#00445B] text-sm xs:text-[14px] 2xl:text-lg 3xl:text-xl text-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureList;
