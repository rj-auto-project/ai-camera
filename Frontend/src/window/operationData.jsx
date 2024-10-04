import { useEffect } from "react";

const NewWindow = () => {
  useEffect(() => {
    window.ipcRenderer.on("new-window-data", (event, data) => {
      console.log("Data received in new window", data);
    });
    return () => {
      window.ipcRenderer.removeAllListeners("new-window-data");
    };
  }, []);

  return (
    <div>
      <h1>Operation Data</h1>
    </div>
  );
};

export default NewWindow;
