import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import CardManager from './components/cardManager/CardManager';
import CreatorPage from './pages/CreatorPage';
import PdfPreviewPage from './pages/PdfPreviewPage';
import MyCardsPage from './pages/MyCardsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Header dentro del Router */}
        <Header />
        <div className="pt-1">
          <Routes>
            <Route path="/creator" element={<CreatorPage />} />
            <Route path="/pdf-preview" element={<PdfPreviewPage />} />
            <Route path="/my-cards" element={<MyCardsPage />} />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;