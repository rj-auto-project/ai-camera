import React, { useEffect, useRef, useState } from "react";

const TrackAgent = () => {
  const [leftWidth, setLeftWidth] = useState(50); // Initial width of the left section in percentage
  const isDragging = useRef(false);

  // Handle drag to resize horizontally (width)
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden ">
      <div
        className="fixed inset-0  filter backdrop-blur-lg z-30"
        style={{ filter: "blur(20px)" }}
      ></div>
      <div className="grid grid-cols-1 h-[55%]">
        {/* Top Section */}
        <div
          className="grid"
          style={{ gridTemplateColumns: `${leftWidth}% ${100 - leftWidth}%` }}
        >
          <div className="  bg-gray-700  flex  justify-center">
            <img src="/assets/d1.jpg" alt="" className="object-cover " />
          </div>
          <div className=" border-gray-700 bg-gray-700  flex  justify-center overflow-hidden">
            <img src="/assets/map.png" alt="" className=" object-cover " />
          </div>
        </div>

        {/* Draggable Divider (Horizontal Resizer) */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 h-[55vh]  bg-gray-500 cursor-col-resize absolute top-0 bottom-0 left-[50%]"
          style={{ left: `${leftWidth}%` }}
        ></div>
      </div>

      {/* Bottom Section (70% - 30% width layout) */}
      <div className="grid grid-cols-10  h-[45%] z-1000">
        <div className="col-span-7 h-[45vh] border  bg-gray-700 p-0">
          <h2 className="text-center text-3xl font-extrabold absolute pl-7 text-black">
            Video Stream{" "}
          </h2>
          <img
            src="/assets/d2.png"
            alt=""
            className="flex justify-center object-cover h-[100%] w-full"
          />
        </div>

        <div className="col-span-3 h-full border-t bg-black p-4">
          <h2 className="text-center text-2xl font-bold text-white pb-10">
            Controller
          </h2>
          <div className="flex flex-col items-center justify-center space-y-9 h-[70%]">
            {/* First row */}
            <div className="w-full flex justify-between px-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">ru1</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">▲</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">ru2</span>
              </div>
            </div>

            {/* Second row */}
            <div className="w-full flex justify-between px-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-red-500 to-red-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">◯</span>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-b from-green-500 to-green-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-lg">Start</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">◻</span>
              </div>
            </div>

            {/* Third row */}
            <div className="w-full flex justify-between px-9">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">ld1</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">X</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-gray-500 to-gray-700 flex items-center justify-center shadow-lg transform hover:scale-110 transition duration-300">
                <span className="text-white text-2xl">rd1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackAgent;
