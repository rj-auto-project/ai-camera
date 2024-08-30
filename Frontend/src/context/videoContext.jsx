import React, { createContext, useState, useContext } from 'react';

const VideoContext = createContext();


export const VideoProvider = ({ children }) => {
  const [videoSrc, setVideoSrc] = useState(null);

  return (
    <VideoContext.Provider value={{ videoSrc, setVideoSrc }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
