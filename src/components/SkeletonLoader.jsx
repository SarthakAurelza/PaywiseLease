import React from 'react';
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="w-full bg-white rounded-lg shadow p-4 sm:p-6 animate-pulse flex flex-col gap-4 h-[380px]">
    <div className="h-48 bg-muted-foreground rounded-md w-full" />
    <div className="h-5 bg-muted-foreground rounded w-3/4" />
    <div className="h-4 bg-muted-foreground rounded w-1/2" />
    <div className="h-10 bg-muted-foreground rounded w-full mt-auto" />
  </div>
);

const SkeletonLoader = ({ count = 4 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-2 md:gap-12 lg:gap-4 xl:gap-8 w-full justify-between xxl:grid-cols-3 xxl:gap-4"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;
