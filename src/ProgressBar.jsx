import React, { useState, useEffect } from "react";
import {
  useLocation,
} from "react-router-dom";

const ProgressBar = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
      if (!isLoading) {
        setIsLoading(true);
      }

      // Simulate loading completion (replace with your actual logic)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Adjust delay

      return () => clearTimeout(timer);
    }, [location]);

    return (
      <div
        style={{
          height: "4px",
          backgroundColor: "#e22d27",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          width: isLoading ? "100%" : "0%", // Set width based on isLoading
          transition: isLoading ? "width 0.4ss ease-in-out" : "none", // Only apply transition when loading
        }}
      ></div>
    );
  };


export default ProgressBar;
