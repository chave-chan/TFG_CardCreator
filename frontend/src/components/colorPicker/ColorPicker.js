import React from 'react';

const ColorPicker = ({ value, onChange }) => {
  return (
    <input
      type="color"
      value={value}
      onChange={onChange}
      className="w-full h-10 p-1 border border-gray-300 rounded"
    />
  );
};

export default ColorPicker;