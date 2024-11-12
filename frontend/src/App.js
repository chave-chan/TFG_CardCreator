import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import CreatorPage from './pages/CreatorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Header dentro del Router */}
        <Header />
        <div className="p-8">
          <Routes>
            <Route path="/creator" element={<CreatorPage />} />
            {/* Agrega más rutas según sea necesario */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;