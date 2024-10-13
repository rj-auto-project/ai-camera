import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const CameraCard = ({ camera, onRemove }) => {
  return (
    <div className="border border-gray-300 rounded-lg mb-1.5 bg-gray-400 overflow-hidden text-black">
      <div className="flex justify-between items-start bg-gray-700 text-white p-1.5 border-b border-gray-300">
        <div className="flex flex-col">
          <strong className="text-sm tracking-wide">{camera.cameraName}</strong>
          <div className="mt-0.5 text-xs tracking-wide">
            <b>Camera Id:</b> {camera.cameraId}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="border-none bg-none cursor-pointer ml-1 p-0"
        >
          <CloseIcon
            fontSize="24px"
            className="bg-red-600 rounded-full text-sm hover:bg-red-400"
          />
        </button>
      </div>
      <div className="p-1">
        <div className="mb-1 text-xs">
          <b className="font-bold">Location:</b>{" "}
          <span className="font-semibold">{camera.location}</span>
        </div>
        <div className="mb-1 text-xs">
          <b className="font-bold">Status:</b>{" "}
          <span className="font-semibold">{camera.status}</span>
        </div>
        <div className="text-xs">
          <b className="font-bold">Type:</b>{" "}
          <span className="font-semibold">{camera.cameraType}</span>
        </div>
      </div>
    </div>
  );
};

export default CameraCard;
