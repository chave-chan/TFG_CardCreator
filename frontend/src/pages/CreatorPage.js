import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatorPage = () => {
  const [cardType, setCardType] = useState('');
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [textFont, setTextFont] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [cardBackground, setCardBackground] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [cards, setCards] = useState([]);
  const [activeView, setActiveView] = useState('preview');

  const navigate = useNavigate();

  const addCard = () => {
    const newCard = { cardType, cardTitle, cardDescription, textFont, textColor, cardBackground, cardBack };
    setCards([...cards, newCard]);
    // Clear form
    setCardType('');
    setCardTitle('');
    setCardDescription('');
    setTextFont('Arial');
    setTextColor('#000000');
    setCardBackground(null);
    setCardBack(null);
  };

  const isAddDisabled = !cardType || !cardTitle || !cardDescription || !textFont || !textColor;


  return (
    <div className="flex h-screen bg-white">
      {/* Left Column - Creator */}
      <div className="relative w-1/2 bg-white p-8 flex flex-col h-full overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Creator</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create Your Card</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Card Type</label>
            <input
              type="text"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter card type"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter card title"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 resize-none"
              placeholder="Enter card description"
              rows="4"
            />
          </div>

          <div className="flex items-center space-x-16">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Text Font</label>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
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

          {/* Add Button */}
          <button
            onClick={addCard}
            disabled={isAddDisabled} // Desactiva el botón si falta algún campo
            className={`absolute bottom-4 right-4 py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isAddDisabled ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Add
          </button>
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="w-1/2 bg-gray-100 p-8 h-full flex flex-col relative">
      <h1 className="text-2xl font-semibold mb-4 text-gray-700">Summary</h1>
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveView('preview')}
            className={`pb-2 ${activeView === 'preview' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`pb-2 ${activeView === 'list' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
          >
            Cards List
          </button>
        </div>

        {/* Conditionally render based on activeView */}
        {activeView === 'preview' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-2/4 h-3/4 bg-white rounded-lg shadow-md flex items-center justify-center">
              <p className="text-gray-500">Card Preview</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto mt-4">
            {cards.length > 0 ? (
              <ul className="space-y-2">
                {cards.map((card, index) => (
                  <li key={index} className="border p-4 rounded-lg bg-white shadow">
                    <h3 className="text-lg font-semibold">{card.cardTitle}</h3>
                    <p>{card.cardDescription}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center mt-4">No cards added yet.</p>
            )}
          </div>
        )}

        {/* Next Button */}
        <button
          disabled={cards.length === 0}
          onClick={() => navigate('/pdf-preview')}
          className={`absolute bottom-4 right-4 py-2 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            cards.length === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreatorPage;