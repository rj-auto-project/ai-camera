import React, { useEffect, useRef } from "react";

const WebRTCStream = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeElement = iframeRef.current;

    // Assign the source URL directly to the iframe element
    iframeElement.src = "http://localhost:8889/cam1/";

    // Optional: Clean up when component is unmounted
    return () => {
      if (iframeElement) {
        iframeElement.src = "";
      }
    };
  }, []);

  return (
    <div>
      <iframe
        ref={iframeRef}
        title="WebRTC Stream"
        width="640"
        height="480"
        frameBorder="0"
        allowFullScreen
        style={{ border: "none" }}
      >
        Sorry, your browser doesn’t support iframes.
      </iframe>
    </div>
  );
};

export default WebRTCStream;
