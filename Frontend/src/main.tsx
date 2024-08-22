import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./store";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000, // Set default staleTime to 5 seconds
      refetchOnWindowFocus: true, // Optional: Refetch on window focus
      retry: 1, // Optional: Number of retries on failure
      refetchOnReconnect: true, // Optional: Refetch on network reconnect
      refetchOnMount: true, // Optional: Refetch on mount
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
