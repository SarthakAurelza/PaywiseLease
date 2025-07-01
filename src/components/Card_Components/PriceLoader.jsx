import React from 'react'
import { motion } from 'framer-motion'

const PriceLoader = ({quoteData}) => {
  return (
    <>
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-primary h-12 xl:h-16 p-2 xs:p-3 sm:p-2 md:p-1 lg:p-2 xl:p-3 pt-4 pb-4 rounded-md flex flex-row items-center justify-between"
            >
              <p className="font-bold text-xl md:text-lg lg:text-3xl text-white xl:text-[32px] 2xl:text-5xl xxl:text-4xl blur-[8px]">
                <span className="sm:text-[8px] xl:text-[12px] 2xl:text-[16px] xxl:text-md 3xl:text-lg text-xs sm:font-semibold">FROM </span>$370
                <span className="sm:text-[10px] xl:text-[14px] 2xl:text-[20px] xxl:text-[16px] text-xs">/week</span>
              </p>
              <button
                className="bg-[#41b6e6] text-white text-xs xl:text-md md:text-[9px] lg:text-xs rounded-md 3xl:rounded-lg px-2 p-1 xs:px-3 xs:p-2 sm:p-1 pt-2 pb-2 sm:pl-3 sm:pr-3 xl:py-2 xl:px-3 3xl:text-lg"
              >
                {!quoteData ? "Loading..." : "View Calculation"}
              </button>
            </motion.div>

          </>
  )
}

export default PriceLoader
