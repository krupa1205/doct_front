import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Calendar, Star, CheckCircle } from 'lucide-react';
import { generateDates, timeSlots } from '../utils';
import apiService from '../../../services/apiService';

const BookingModal = ({ isOpen, onClose, doctor }) => {
  const [selectedTrialType, setSelectedTrialType] = useState('free');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates] = useState(generateDates());

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      setBookingError('Please select both date and time');
      return;
    }

    if (!apiService.isAuthenticated()) {
      setBookingError('Please login to book an appointment');
      return;
    }

    try {
      setIsBooking(true);
      setBookingError('');

      // For now, we'll show a success message since we need actual slot data
      // TODO: Implement actual booking with slot selection
      alert(`Booking request submitted for ${doctor?.user?.name || doctor?.name} on ${selectedDate} at ${selectedTime}`);
      onClose();
      
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedTrialType('free');
    } catch (error) {
      setBookingError(error.message || 'Failed to book appointment. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-light-black border border-gray-700 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-white">Select Date and Time</h2>
              <div className="flex items-center mt-2">
                <img
                  src={doctor?.imgSrc}
                  alt={doctor?.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <span className="text-sm text-gray-300">Book a trial session with {doctor?.name}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>

          <div className="p-6">
            {/* Trial Type Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-white mb-4">Choose Your Trial Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Free Trial */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedTrialType === 'free'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedTrialType('free')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">Free Trial</span>
                    <span className="text-green-400 font-bold">Free</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Basic mentorship session
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      30 minutes session duration
                    </div>
                  </div>
                </div>

                {/* Golden Trial */}
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedTrialType === 'golden'
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedTrialType('golden')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium text-white">Golden Trial</span>
                    </div>
                    <span className="text-yellow-400 font-bold">₹199</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      100% show up by mentor
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Priority Slot within 24hrs
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      Personalised mentorship plan
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-white mb-4">
                Select Date
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full ml-2">
                  RECOMMENDED
                </span>
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {availableDates.map((dateObj, index) => (
                  <div
                    key={index}
                    className={`text-center p-3 rounded-xl cursor-pointer transition-all ${
                      selectedDate === dateObj.fullDate
                        ? 'bg-green-500/20 border-2 border-green-500'
                        : 'border border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedDate(dateObj.fullDate)}
                  >
                    <div className="text-xs text-gray-400 mb-1">{dateObj.dayName}</div>
                    <div className="font-medium text-white mb-1">{dateObj.date}</div>
                    <div className="text-xs text-green-400">{dateObj.slots}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h3 className="font-medium text-white mb-4">
                Select Time
                <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full ml-2">
                  RECOMMENDED
                </span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`p-3 rounded-xl text-sm font-medium transition-all ${
                      selectedTime === time
                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : 'border border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-gray-800 border border-gray-600 rounded-xl p-4 mb-6">
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="w-4 h-4 mr-2 text-green-400" />
                  <span>{selectedDate}</span>
                  <Clock className="w-4 h-4 ml-4 mr-2 text-green-400" />
                  <span>{selectedTime} to 09:00 PM</span>
                  <span className="ml-auto text-green-400">30min (Session Time Slot)</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {bookingError && (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 mb-6">
                <p className="text-red-400 text-sm">{bookingError}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={isBooking}
              className={`w-full font-medium py-3 px-4 rounded-xl transition-colors ${
                isBooking 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isBooking ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;