import React, { useState, useEffect } from 'react';
import { BookingModal, SearchFilter, HeroSection, DoctorsGrid } from './components';

import apiService from '../../services/apiService';

// --- Main FindDoctorPage Component ---
function FindDoctorPage() {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [filters, setFilters] = useState({});
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Fetch doctors from API
  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const apiFilters = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        specialty: selectedSpecialty !== 'All Specialties' ? selectedSpecialty : null,
        ...filters
      };

      const response = await apiService.searchDoctors(apiFilters);
      
      if (response.success) {
        const doctorsData = response.data.doctors || [];
        setDoctors(doctorsData);
        setFilteredDoctors(doctorsData);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch doctors');
      }
    } catch (err) {
      setError(err.message);
      setDoctors([]);
      setFilteredDoctors([]);
      console.error('Error fetching doctors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSpecialty, filters]);

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedDoctor(null);
  };

  if (error) {
    return (
      <div className="bg-black text-white min-h-screen pt-24 md:pt-20 p-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchDoctors} 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pt-24 md:pt-20 p-20">
      <main className="main-container px-6">
        {/* Hero Section */}
        <HeroSection />

        {/* Search & Filter Section */}
        <SearchFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          filters={filters}
          setFilters={setFilters}
        />

        {/* Results Summary */}
        {!isLoading && (
          <div className="text-center mb-8">
            <p className="text-gray-400">
              {filteredDoctors.length === 0 
                ? 'No doctors found matching your criteria' 
                : `Found ${pagination.total} doctor${pagination.total > 1 ? 's' : ''}`
              }
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="doctor-list m-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DoctorsGrid 
            doctors={filteredDoctors}
            onBookNow={handleBookNow}
            isLoading={isLoading}
          />
        </div>

        {/* Pagination */}
        {!isLoading && pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Previous
              </button>
              
              <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className={`px-4 py-2 rounded-lg ${
                  pagination.page === pagination.pages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={closeBookingModal}
        doctor={selectedDoctor}
      />
    </div>
  );
}

export default FindDoctorPage;