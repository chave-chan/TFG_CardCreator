import React from 'react';

const Button = ({ onClick, label, type = 'button' }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
    >
      {label}
    </button>
  );
};

export default Button;
