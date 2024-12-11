// CustomAlert.js
import React, { useEffect } from "react";
import "../css/CustomAlert.css"; // Стили для кастомного alert

const CustomAlert = ({ message, onClose}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="custom-alert">
      <div className="alert-content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CustomAlert;
