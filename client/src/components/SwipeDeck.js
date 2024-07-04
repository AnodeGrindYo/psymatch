import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import SwipeCard from './SwipeCard';
import { Link } from 'react-router-dom';
import Layout from './Layout';

const SwipeDeck = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch psychologists from the backend with authorization header
    fetch('/api/psychologists', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPsychologists(data))
      .catch(error => console.error('Error fetching psychologists:', error));
  }, []);

  const handleSwipeLeft = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSwipeRight = () => {
    const selectedPsychologist = psychologists[currentIndex];
    fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ psychologistId: selectedPsychologist._id }),
    });
    setCurrentIndex(currentIndex + 1);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (currentIndex >= psychologists.length) {
    return <p className="text-center text-gray-700">Plus de psychologues disponibles</p>;
  }

  return (
    <Layout>
      <div {...swipeHandlers} className="flex flex-col items-center justify-center min-h-screen">
        <div className="absolute top-0 right-0 m-4">
          <Link to="/main" className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times fa-2x"></i>
          </Link>
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <SwipeCard 
            psychologist={psychologists[currentIndex]} 
            onSwipeLeft={handleSwipeLeft} 
            onSwipeRight={handleSwipeRight} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default SwipeDeck;
