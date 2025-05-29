import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import HomePage from './pages/HomePage';
import CreatorPage from './pages/CreatorPage';
import PdfPreviewPage from './pages/PdfPreviewPage';
import MyCardsPage from './pages/MyCardsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <div className="pt-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/creator" element={<CreatorPage />} />
            <Route path="/pdf-preview" element={<PdfPreviewPage />} />
            <Route path="/my-cards" element={<MyCardsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;