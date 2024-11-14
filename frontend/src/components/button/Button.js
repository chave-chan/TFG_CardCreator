import React from 'react';

const Button = ({ onClick, disabled, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        disabled
          ? 'bg-gray-200 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
