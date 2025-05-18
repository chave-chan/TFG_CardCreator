import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import CreatorPage from './pages/CreatorPage';
import PdfPreviewPage from './pages/PdfPreviewPage';
import MyCardsPage from './pages/MyCardsPage';
import { postTestCard, getTestCards } from './services/apiService'; /// TESTING

///TESTING

function HomeTest() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handlePost = async () => {
    setLoading(true);
    try {
      await postTestCard({ title, text });
      alert('Carta enviada correctamente');
      setTitle('');
      setText('');
    } catch (err) {
      console.error(err);
      alert('Error enviando la carta');
    }
    setLoading(false);
  };

  const handleGet = async () => {
    setLoading(true);
    try {
      const data = await getTestCards();
      setCards(data);
    } catch (err) {
      console.error(err);
      alert('Error obteniendo las cartas');
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Home / Pruebas API</h1>

      <div className="mb-4 space-y-2">
        <div>
          <label className="block font-medium mb-1">Título:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Escribe el título de la carta"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Texto:</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Escribe el texto de la carta"
            rows={3}
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handlePost}
          disabled={loading || !title.trim() || !text.trim()}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Enviando…' : 'Enviar carta de prueba'}
        </button>
        <button
          onClick={handleGet}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Cargando…' : 'Traer cartas de prueba'}
        </button>
      </div>

      {cards.length > 0 ? (
        <ul className="space-y-2">
          {cards.map((card, idx) => (
            <li key={idx} className="border p-4 rounded-lg bg-white shadow">
              <h3 className="font-semibold">{card.title}</h3>
              <p>{card.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay cartas almacenadas aún.</p>
      )}
    </div>
  );
}

///

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* Header dentro del Router */}
        <Header />
        <div className="pt-1">
          <Routes>
            {/* TESTING */}
            <Route path="/" element={<HomeTest />} /> 
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