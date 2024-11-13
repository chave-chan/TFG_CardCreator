import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfPreviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white p-8">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">PDF Preview</h1>
      </header>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col w-80">
          <label className="text-lg font-semibold text-gray-700">Deck Name</label>
          <input
            type="text"
            placeholder="Deck Name"
            className="mt-2 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Add to favorites</span>
          <button className="text-gray-500 hover:text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25L18.18 21l-1.64-7.03L22 9.74l-7.19-.61L12 2.5 9.19 9.13 2 9.74l5.46 4.23L5.82 21z" />
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Previewer */}
      <div className="flex-1 flex justify-center items-center mb-4 border rounded-lg shadow">
        <div className="w-[210mm] h-[297mm] overflow-auto">
          <Document
            file="/path-to-your-pdf-file.pdf" // TO DO: CHANGE THIS TO THE CORRECT PATH
            onLoadSuccess={({ numPages }) => console.log(`Loaded PDF with ${numPages} pages`)}
          >
            <Page pageNumber={1} scale={scale} />
          </Document>
        </div>
      </div>

      {/* Zoom Buttons */}
      <div className="flex space-x-4 mb-4 justify-center">
        <button onClick={() => setScale(scale + 0.2)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none">
          Zoom In
        </button>
        <button onClick={() => setScale(scale - 0.2)} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none">
          Zoom Out
        </button>
      </div>

      {/* Back to Creator Button */}
      <button
        onClick={() => navigate('/creator')}
        className="absolute bottom-4 left-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Back
      </button>

    </div>
  );
};

export default PdfPreviewPage;
