import React, { useState, useEffect } from 'react';

const AvailableSlots = ({ psychologistId, onSlotSelected }) => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    fetch(`/api/psychologists/${psychologistId}/slots`)
      .then(response => response.json())
      .then(data => setSlots(data))
      .catch(error => console.error('Error fetching slots:', error));
  }, [psychologistId]);

  return (
    <div>
      <h2>Available Slots</h2>
      {slots.length === 0 && <p>No available slots</p>}
      <ul>
        {slots.map((slot, index) => (
          <li key={index}>
            {slot.day} - {slot.timeSlots.map(timeSlot => (
              <button key={timeSlot.start} onClick={() => onSlotSelected(slot.day, timeSlot)}>
                {timeSlot.start} - {timeSlot.end}
              </button>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableSlots;
