import React from 'react';

const FileInput = ({ onChange }) => {
  return (
    <div className="mb-4">
      <input
        type="file"
        onChange={(e) => onChange(e.target.files[0])}
        className="w-full text-gray-700"
      />
    </div>
  );
};

export default FileInput;
