import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store";
import { VideoProvider } from "./context/videoContext.jsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
      refetchOnWindowFocus: true,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <VideoProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </VideoProvider>
    </Provider>
  </React.StrictMode>,
);

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
