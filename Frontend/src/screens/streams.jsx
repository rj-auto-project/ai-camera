import React, { useState } from 'react';
import { GrPrevious } from "react-icons/gr";

const StreamPage = () => {
  const itemsPerPage = 9; // Number of items per page
  const totalItems = 30; // Total number of items
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

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

  const displayedItems = Array.from({ length: totalItems })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((_, index) => (
      <div
        key={index}
        className="bg-[#121212] shadow-md rounded-lg h-60 w-[400px] flex items-center justify-center text-xl text-white font-bold"
      >
        Box {index + 1 + (currentPage - 1) * itemsPerPage}
      </div>
    ));

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black relative">
      <div className="grid grid-cols-3 gap-4 mb-[80px] ">
        {displayedItems}
      </div>

      {/* Pagination Controls */}
      <div className= 'flex justify-center gap-3 items-center  text-black absolute bottom-10'>
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          <GrPrevious  className=''/>
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
          <GrPrevious  className='rotate-180'/>
        </button>
      </div>
    </div>
  );
};

export default StreamPage;


// {`flex items-center justify-center space-x-2 p-4 text-black ${totalItems <=3 ? 'absolute bottom-0 w-full bg-green-900': 'bg-yellow-700'}`}