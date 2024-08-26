
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrPrevious } from "react-icons/gr";
import vid from "../assets/vvvid.mp4";

const StreamPage = () => {
  const itemsPerPage = 9;
  const totalItems = 30;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBoxClick = (cameraId) => {
    navigate(`${cameraId}`);
  };

  const displayedItems = Array.from({ length: totalItems })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((_, index) => (
      <div
        key={index}
        className="bg-[#121212] cursor-pointer shadow-md rounded-lg h-60 w-[400px] flex items-center justify-center text-xl text-white font-bold relative"
        onClick={() => handleBoxClick(index + 1 + (currentPage - 1) * itemsPerPage)}
      >
        <video
          className="absolute inset-0 h-full w-full object-cover rounded-lg"
          controls
          autoPlay
        >
          <source src={vid} type='video/mp4' />
        </video>
         <div />
      </div>
    ));

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black relative">
      <div className="grid grid-cols-3 gap-4 mb-[80px]">
        {displayedItems}
      </div>

      <div className='flex justify-center gap-3 items-center text-black absolute bottom-10'>
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          <GrPrevious />
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 hover:-translate-y-1 ease-in-out duration-150 rounded-full ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'text-white font-semibold hover:bg-gray-900'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === totalPages}
        >
          <GrPrevious className='rotate-180' />
        </button>
      </div>
    </div>
  );
};

export default StreamPage;
