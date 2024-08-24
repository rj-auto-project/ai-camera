import React, { useState } from 'react';

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
        className="bg-white shadow-md rounded-lg h-64 w-[370px] flex items-center justify-center text-xl text-black font-bold"
      >
        Box {index + 1 + (currentPage - 1) * itemsPerPage}
      </div>
    ));

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="grid grid-cols-3 gap-4 p-4">
        {displayedItems}
      </div>

      {/* Pagination Controls */}
      <div className=" flex items-center space-x-2 text-black ">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
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
          Next
        </button>
      </div>
    </div>
  );
};

export default StreamPage;














































// import React from 'react'

// const Streams = () => {
//   return (
//     <div className="w-full min-h-screen flex items-center justify-center  bg-black">
//     <div className="grid grid-cols-3 gap-4 p-4">
//       {Array.from({ length: 9 }).map((_, index) => (
//         <div
//           key={index}
//           className="bg-white shadow-md rounded-lg h-64 w-[370px] flex items-center justify-center text-xl font-bold"
//         >
//           Box {index + 1}
//         </div>
//       ))}
//     </div>
//   </div>

//   )
// }

// export default Streams
