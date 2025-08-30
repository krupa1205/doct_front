import React from 'react';
import DoctorCard from './DoctorCard';

const DoctorsGrid = ({ doctors, onBookNow }) => {
  if (doctors.length === 0) {
    return (
      <p className="text-gray-300 col-span-full text-center">
        No doctors found matching your criteria.
      </p>
    );
  }

  return (
    <>
      {doctors.map((doctor) => (
        <DoctorCard 
          doctor={doctor} 
          key={doctor.id} 
          onBookNow={onBookNow}
        />
      ))}
    </>
  );
};

export default DoctorsGrid;