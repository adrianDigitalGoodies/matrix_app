import React from 'react';
import './FetchButtonStyles.css';

interface FetchButtonProps {
  label: string;
  url: string;
  onClick: () => void;
}

const FetchButton: React.FC<FetchButtonProps> = ({ label, url, onClick }) => {
  return (
    <button className="fetch-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default FetchButton;
