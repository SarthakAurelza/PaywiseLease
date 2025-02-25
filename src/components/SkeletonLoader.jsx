import React from 'react';
import { motion } from "framer-motion";

const SkeletonLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-[660px] justify-between"
    >
                  <div className="animate-pulse bg-gray-200 rounded-lg w-full h-20"></div>
                  <div className="animate-pulse bg-gray-200 rounded-lg w-full h-72"></div>
                  <div className="animate-pulse bg-gray-200 rounded-lg w-full h-16"></div>
                  <div className="flex justify-between">
                    <div className="animate-pulse bg-gray-200 rounded-lg w-1/3 h-24"></div>
                    <div className="animate-pulse bg-gray-200 rounded-lg w-1/3 h-24"></div>
                    <div className="animate-pulse bg-gray-200 rounded-lg w-1/3 h-24"></div>
                  </div>
    </motion.div>
  );
};

export default SkeletonLoader;
