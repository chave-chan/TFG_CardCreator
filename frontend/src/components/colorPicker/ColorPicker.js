import React from 'react';

const ColorPicker = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 p-1 border rounded-md cursor-pointer"
      />
    </div>
  );
};

export default ColorPicker;
