import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      {/* Title */}
      <Link to="/" className="text-2xl font-bold text-gray-800">Card Creator</Link>

      {/* Navigation menu */}
      <nav className="flex items-center">
        <Link to="/" className="text-gray-600 hover:text-gray-900 mr-4">Home</Link>
        <Link to="/creator" className="text-gray-600 hover:text-gray-900 mr-4">Creator</Link>
        <Link to="/my-cards" className="text-gray-600 hover:text-gray-900 mr-4">My Cards</Link>
        <Link to="/profile" className="text-gray-600 hover:text-gray-900 mr-4">Profile</Link>
        <Link to="profile" className="ml-2 w-10 h-10 bg-gray-300 rounded-full"></Link>
      </nav>
    </header>
  );
};

export default Header;