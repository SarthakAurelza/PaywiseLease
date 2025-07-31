const QuoteButton = ({ activeButton, handleButtonClick }) => (
  <div className="flex justify-between">
    {['Weekly', 'Fortnightly', 'Monthly'].map((button) => (
      <button
        key={button}
        onClick={() => handleButtonClick(button)}
        className={`border text-sm 2xl:text-[16px] 3xl:text-xl px-3 xs:px-6 xs:py-2 p-1 rounded-lg font-semibold ${
          activeButton === button ? 'bg-[#41b6e6] text-black' : 'bg-white'
        }`}
      >
        {button}
      </button>
    ))}
  </div>
);

export default QuoteButton;
