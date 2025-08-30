// Doctor data and utility functions

export const doctorSpecialties = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Orthopedic Surgeon',
  'Pediatrician',
  'Psychiatrist'
];

export const getDoctorsData = () => [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    experience: '15+ years',
    description: 'Expert in treating complex heart conditions and promoting cardiovascular wellness through preventative care.',
    imgSrc: 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 2,
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatologist',
    experience: '7+ years',
    description: 'Specializes in cosmetic dermatology and advanced skin care treatments for all ages.',
    imgSrc: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    specialty: 'Neurologist',
    experience: '12+ years',
    description: 'Focused on diagnosing and treating disorders of the nervous system, including migraines and epilepsy.',
    imgSrc: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 4,
    name: 'Dr. Robert Kim',
    specialty: 'Orthopedic Surgeon',
    experience: '9+ years',
    description: 'Dedicated to restoring mobility and quality of life through advanced surgical techniques.',
    imgSrc: 'https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 5,
    name: 'Dr. Lisa Thompson',
    specialty: 'Pediatrician',
    experience: '6+ years',
    description: 'Compassionate care for children from infancy through adolescence, focusing on development and wellness.',
    imgSrc: 'https://images.pexels.com/photos/3957987/pexels-photo-3957987.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 6,
    name: 'Dr. James Wilson',
    specialty: 'Psychiatrist',
    experience: '8+ years',
    description: 'Providing comprehensive mental health care with a focus on therapy and personalized treatment plans.',
    imgSrc: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const filterDoctors = (doctors, searchQuery, selectedSpecialty) => {
  const query = searchQuery.toLowerCase();
  const specialty = selectedSpecialty.toLowerCase();

  return doctors.filter(doctor => {
    const name = doctor.name.toLowerCase();
    const spec = doctor.specialty.toLowerCase();
    
    const nameMatches = name.includes(query);
    const specialtyMatches = specialty === 'all specialties' || spec.includes(specialty);

    return nameMatches && specialtyMatches;
  });
};