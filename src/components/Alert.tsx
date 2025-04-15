import React from 'react';
import './Alert.css';

interface AlertProps {
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
  return (
    <div className="alert">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Alert;
