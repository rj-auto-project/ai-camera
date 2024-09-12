import React, { useEffect, useState } from "react";

function NewWindow() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for the data from the main process
    window.ipcRenderer.on("new-window-data", (event, data) => {
      setMessage(data.message);
    });
    // Cleanup listener on unmount
    return () => {
      window.ipcRenderer.removeAllListeners("new-window-data");
    };
  }, []);
  return (
    <div>
      <h1>New Window</h1>
      <p>Data received: {message}</p>
    </div>
  );
}

export default NewWindow;
