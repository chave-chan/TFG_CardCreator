import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-gray-800">Card Creator</Link>

      <nav className="flex items-center space-x-6">
        <Link
          to="/"
          className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/' ? 'font-bold' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/creator"
          className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/creator' ? 'font-bold' : ''}`}
        >
          Creator
        </Link>
        <Link
          to="/my-cards"
          className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/my-cards' ? 'font-bold' : ''}`}
        >
          My Cards
        </Link>
        <Link
          to="/profile"
          className={`text-gray-600 hover:text-gray-900 ${location.pathname === '/profile' ? 'font-bold' : ''}`}
        >
          Profile
        </Link>
        <Link to="profile" className="ml-2 w-10 h-10 bg-gray-300 rounded-full"></Link>
      </nav>
    </header>
  );
};

export default Header;