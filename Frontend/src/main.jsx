import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// Set base URL for API requests using env var on Vercel, else use relative paths for Vite proxy
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
// Enable sending cookies by default for all requests
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
