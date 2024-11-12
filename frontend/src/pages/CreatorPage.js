// src/pages/CreatorPage.js
import React, { useState } from 'react';

const CreatorPage = () => {
  const [cardType, setCardType] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [textFont, setTextFont] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [cardBackground, setCardBackground] = useState(null);
  const [cardBack, setCardBack] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Left Column - Form, White Background */}
      <div className="w-1/2 bg-white p-8 flex flex-col h-full overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Your Card</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Card Type</label>
            <input
              type="text"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
              placeholder="Enter card type"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
              placeholder="Enter card title"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200 resize-none"
              placeholder="Enter card description"
              rows="4"
            />
          </div>

          <div className="flex items-center space-x-32">
            <div>
              <label className="block text-gray-700 mb-1">Text Font</label>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
              >
                <option>Arial</option>
                <option>Courier New</option>
                <option>Times New Roman</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Background</label>
            <input
              type="file"
              onChange={(e) => setCardBackground(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Back</label>
            <input
              type="file"
              onChange={(e) => setCardBack(e.target.files[0])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Right Column - Card Preview, Gray Background */}
      <div className="w-1/2 bg-gray-100 p-8 flex items-center justify-center h-full relative">
        <div className="w-2/4 h-3/4 bg-white rounded-lg shadow-md flex items-center justify-center">
          <p className="text-gray-500">Card Preview</p>
        </div>

        {/* Save Button in the Bottom Right Corner */}
        <button
          className="absolute bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Guardar
        </button>
      </div>
    </div>
  );
};

export default CreatorPage;