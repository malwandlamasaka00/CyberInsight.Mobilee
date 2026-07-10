// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";  // Add this import
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  
      <AuthProvider>
        <App />
      </AuthProvider>
  
  </React.StrictMode>
);