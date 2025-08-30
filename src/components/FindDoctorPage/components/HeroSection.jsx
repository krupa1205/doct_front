import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <motion.div 
      className="hero text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Find Your <span className="text-green-400">Perfect Doctor</span>
      </h1>
      <p className="text-gray-300 max-w-2xl mx-auto">
        Browse our network of verified healthcare professionals and book your consultation with ease.
      </p>
    </motion.div>
  );
};

export default HeroSection;