import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import vid from "../assets/vvvid.mp4"; // Import your video file

const ModalPage = () => {
  const { boxIndex,cameraId } = useParams();
  // const cameraId = "CAM-12345"; // Example Camera ID
  const areaName = "Downtown Area"; // Example Area Name
  const navigate = useNavigate();
  const handleMiniPlayerClick = (cameraId) => {
    navigate(`/dashboard/streams/${cameraId}`);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 p-4">
        {/* Camera Details */}
        <div className="mb-4 text-white">
          <p className="text-xl font-bold">Camera ID: {cameraId}</p>
          <p className="text-lg text-gray-400">Area: {areaName}</p>
        </div>
        {/* Main Video Player */}
        <div className="flex items-center justify-center">
          <video className="w-full h-auto rounded-lg shadow-lg" src={vid} controls></video>
        </div>
      </div>

      {/* Mini Player - Right Column */}
      <div className="w-1/4 bg-[#121212] p-4 text-white">
        <h2 className="text-2xl font-bold mb-4">Mini Player</h2>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-800 p-2 rounded-lg flex items-center cursor-pointer"  onClick={()=>handleMiniPlayerClick(index + 1)}>
              {console.log(index)}
              <video className="w-24 h-16 mr-4 rounded" src={vid} ></video>
              <div className="text-sm">
                <p className="font-bold">Video Title {index + 1}</p>
                <p className="text-gray-400">Channel Name</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalPage;
