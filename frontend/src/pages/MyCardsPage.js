import React, { useState } from 'react';

const MyCardsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const decks = [
    { name: 'Deck Name', favorite: true },
    { name: 'Deck Name', favorite: true },
    { name: 'Deck Name', favorite: true },
    { name: 'Deck Name', favorite: false },
    { name: 'Deck Name', favorite: false },
    { name: 'Deck Name', favorite: false },
  ];

  const filteredDecks = activeTab === 'all' ? decks : decks.filter(deck => deck.favorite);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Cards</h1>
      
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          All Cards
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-2 ${activeTab === 'favorites' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Favorites
        </button>
      </div>

      {/* Card Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {filteredDecks.map((deck, index) => (
          <div key={index} className="relative border rounded-lg p-4">
            <div className="absolute top-2 right-2">
              <button>
                {deck.favorite ? (
                  <span className="text-yellow-500 text-2xl">★</span>
                ) : (
                  <span className="text-gray-400 text-2xl">☆</span>
                )}
              </button>
            </div>
            <h2 className="text-lg font-semibold mb-4">{deck.name}</h2>
            <div className="w-full h-96 border rounded-lg flex items-center justify-center">
              <span className="text-gray-500">PDF</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCardsPage;