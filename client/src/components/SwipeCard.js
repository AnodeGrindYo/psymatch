import React from 'react';

const SwipeCard = ({ psychologist, onSwipeLeft, onSwipeRight }) => {
  const profilePicture = psychologist.profilePicture || '/path/to/default/profile/picture.jpg';

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-6 rounded-lg shadow-md text-center">
      <img 
        src={profilePicture} 
        alt={`${psychologist.firstName} ${psychologist.lastName}`} 
        className="w-32 h-32 rounded-full mx-auto mb-4" 
      />
      <h2 className="text-xl font-semibold text-blue-500 mb-2">
        {psychologist.firstName} {psychologist.lastName}
      </h2>
      <p className="text-gray-700 mb-2">
        {psychologist.specialization.join(', ')}
      </p>
      <p className="text-gray-500 mb-4">
        Note moyenne: {psychologist.ratings.length > 0 
          ? (psychologist.ratings.reduce((a, b) => a + b, 0) / psychologist.ratings.length).toFixed(1) 
          : 'N/A'}
      </p>
      <div className="flex justify-around w-full">
        <button 
          onClick={onSwipeLeft} 
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition">
          <i className="fas fa-times"></i>
        </button>
        <button 
          onClick={onSwipeRight} 
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
          <i className="fas fa-check"></i>
        </button>
      </div>
    </div>
  );
};

export default SwipeCard;
