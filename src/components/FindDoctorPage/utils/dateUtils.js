// Date utility functions for booking modal

export const generateDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const slots = Math.floor(Math.random() * 50) + 5; // Random slots between 5-54
    
    dates.push({
      dayName,
      date: `${dayNum} ${month}`,
      fullDate: date.toISOString().split('T')[0],
      slots: `${slots} Slots`
    });
  }
  
  return dates;
};

export const timeSlots = [
  '08:30 PM', '08:45 PM', '09:00 PM', '09:15 PM', '09:30 PM'
];