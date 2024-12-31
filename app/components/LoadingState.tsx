import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const images = [
    '/first.png',
    '/second.png',
    '/three.png',
    '/four.png', 
    '/five.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="fixed inset-0 bg-[#161616] z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <img 
          src={images[currentImageIndex]} 
          alt={`Loading ${currentImageIndex + 1}`}
          className="w-full h-auto rounded-lg shadow-lg mb-4"
        />
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
