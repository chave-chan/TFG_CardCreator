import React from 'react';

const FileInput = ({ onChange }) => {
  return (
    <input
      type="file"
      onChange={onChange}
      className="w-full text-gray-700"
    />
  );
};

export default FileInput;
