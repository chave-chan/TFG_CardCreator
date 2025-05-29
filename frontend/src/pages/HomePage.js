import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="text-center p-8 space-y-6">
          <h1 className="font-caprasimo text-5xl font-bold">Welcome to Card Creator</h1>
          <p className="text-xl">Design, preview and export your custom cards in seconds.</p>
          <div className="space-x-4">
            <Button onClick={() => navigate('/creator')}>Start Creating</Button>
            <Button onClick={() => navigate('/my-cards')}>View My Cards</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-semibold">Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Customizable Design</h3>
              <p>Upload your own SVG backgrounds, choose fonts, colors, and alignments.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Live Preview</h3>
              <p>See a preview of each card as you input your content.</p>
            </div>
            <div className="p-6 border rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Export PDF</h3>
              <p>Generate a ready-to-print PDF with multiple cards per page.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-8 bg-gray-100 text-center">
        <p className="mb-4">Ready to get started?</p>
        <Button onClick={() => navigate('/creator')}>Go to Creator</Button>
      </footer>
    </div>
  );
};

export default HomePage;