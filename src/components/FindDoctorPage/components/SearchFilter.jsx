import React from 'react';
import { motion } from 'framer-motion';
import { doctorSpecialties } from '../utils';

const SearchFilter = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedSpecialty, 
  setSelectedSpecialty 
}) => {
  return (
    <motion.div 
      className="search-box bg-[#000] border border-gray-700 p-4 rounded-2xl flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <input
        type="text"
        className="w-full bg-light-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        placeholder="Search by doctor's name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        className="w-full md:w-64 bg-light-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        value={selectedSpecialty}
        onChange={(e) => setSelectedSpecialty(e.target.value)}
      >
        {doctorSpecialties.map((specialty) => (
          <option key={specialty} value={specialty}>
            {specialty}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default SearchFilter;