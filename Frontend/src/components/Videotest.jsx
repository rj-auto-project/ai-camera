import React, { useRef, useEffect } from 'react';

const VideoStream = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Set the source of the video element
    if (videoRef.current) {
      videoRef.current.src = 'http://192.168.1.10:8889/cam1/';
    }
  }, []);

  return (
    <div>
      <h3>Video Stream</h3>
      {/* The video element */}
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ width: '100%', maxHeight: '500px' }} // Adjust styles as needed
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoStream;
