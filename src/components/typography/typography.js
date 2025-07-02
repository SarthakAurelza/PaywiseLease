// designSystem.ts
export const typography = {
  heading: {
    h1: "lg:text-5xl sm:text-[42px] xs:text-4xl text-2xl font-bold mb-2 md:text-4xl 2xl:text-6xl xxl:text-7xl md:text-start text-center 3xl:text-8xl text-[#41b6e6]",
    h2: "xs:text-lg lg:text-xl font-bold mb-4 xl:text-2xl 2xl:text-3xl xxl:text-4xl 3xl:text-5xl",
    h3: "w-full lg:pr-16 lg:pl-16 lg:pt-16 pb-4 pr-4 pl-4 pt-8 xs:pr-6 xs:pl-6 xs:pt-10 xs:text-lg sm:text-md md:text-lg lg:text-xl xl:text-2xl 3xl:text-3xl",
    h4: "text-md font-bold xl:text-xl 2xl:text-2xl",
    h5: "text-md font-normal xl:text-xl 2xl:text-2xl",
    h6: "text-sm font-light text-muted-foreground xl:text-lg 2xl:text-xl",
  },
  content: {
    sm: "text-sm text-gray-600",
    base: "text-base text-gray-700",
    lg: "text-lg text-gray-800",

    price_content: "font-bold text-white w-[50%] flex flex-col leading-1"
  },

  card: {
    carCard: "w-[100%] flex flex-col items-center gap-4 p-4 rounded-xl bg-[#F3F6F7] justify-self-center max-w-[350px] justify-between h-full"
  } 
};

export const buttons = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded",
  danger: "bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded",
  compare_inactive: "bg-transparent text-primary font-semibold border rounded-xl 3xl:rounded-2xl h-6 w-[100px] sm:h-4 sm:w-[70px] lg:h-5 lg:w-[80px] text-[10px] sm:text-[8px]  lg:text-[9px] xl:text-[12px] 3xl:text-sm xl:w-[110px] 3xl:w-[150px] 3xl:h-8 xl:h-7 border-muted",
  compare_active: "bg-primary text-white font-semibold border rounded-xl 3xl:rounded-2xl h-6 w-[100px] sm:h-4 sm:w-[70px] lg:h-5 lg:w-[80px] text-[10px] sm:text-[8px]  lg:text-[9px] xl:text-[12px] 3xl:text-sm xl:w-[110px] 3xl:w-[150px] 3xl:h-8 xl:h-7 border-muted",
  view_calculation: "bg-[#41b6e6] text-black font-semibold text-xs p-2 rounded md:text-md xl:text-[15px] xl:rounded-lg",
  roundButton: "rounded-full bg-gray-100 px-3 py-1 font-bold hover:bg-gray-200 border border-primary",

}

export const containers = {
  price_container: "w-full bg-primary px-2 py-1 rounded-md flex flex-row items-center justify-between xl:px-3 xl:py-2",
}

export const grids = {
  carFeatureGrid: "w-full grid grid-cols-[2fr_1fr] gap-4",
  compareGrid: " w-full grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-16"
}
