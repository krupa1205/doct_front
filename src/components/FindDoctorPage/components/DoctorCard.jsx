import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Award } from 'lucide-react';

const DoctorCard = ({ doctor, onBookNow, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-600"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-600 rounded w-2/3"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          <div className="h-16 bg-gray-600 rounded"></div>
          <div className="flex gap-4">
            <div className="flex-1 h-12 bg-gray-600 rounded-xl"></div>
            <div className="flex-1 h-12 bg-gray-600 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API response structure
  const userName = doctor.user?.name || doctor.name || 'Unknown Doctor';
  const userAvatar = doctor.user?.avatarUrl || doctor.imgSrc || 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1';
  const specialties = doctor.specialties?.map(s => s.specialty?.name).join(', ') || doctor.specialty || 'General Medicine';
  const rating = doctor.ratingAvg || doctor.rating || 4.5;
  const experience = doctor.experience || `${Math.floor(Math.random() * 15) + 5}+ years`;
  const description = doctor.shortBio || doctor.description || 'Experienced medical professional dedicated to providing quality healthcare.';
  const price = doctor.priceCents ? (doctor.priceCents / 100) : (doctor.price || 500);
  const isVerified = doctor.isVerified || false;
  const availableSlots = doctor.slots?.filter(slot => slot.isAvailable)?.length || 0;

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl overflow-hidden group transition-all duration-300 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/10 hover:scale-105"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={userAvatar} 
          alt={`Dr. ${userName}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1';
          }}
        />
        {isVerified && (
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
              ✓ Verified
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        {availableSlots > 0 && (
          <div className="absolute bottom-3 right-3 bg-green-500/20 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-green-400 text-xs font-medium">{availableSlots} slots</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{userName}</h3>
          <p className="text-green-400 font-medium mb-2 flex items-center gap-1">
            <Award className="w-4 h-4" />
            {specialties}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{experience}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Online</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-6 h-12 overflow-hidden leading-relaxed">
          {description}
        </p>
        
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 text-sm">Consultation Fee</span>
            <span className="text-green-400 font-bold">₹{price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href={`/profile/${doctor.id}`} 
            className="flex-1 text-center bg-gray-700/50 hover:bg-gray-600 transition-all duration-200 border border-gray-600 text-white font-medium py-3 px-4 rounded-xl text-sm hover:border-gray-500"
          >
            View Profile
          </a>
          <button 
            onClick={() => onBookNow(doctor)}
            className="flex-1 text-center font-medium py-3 px-4 rounded-xl text-sm transition-all duration-200 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;