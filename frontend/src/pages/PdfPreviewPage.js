import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/node_modules/pdfjs-dist/build/pdf.worker.min.js`;

const PdfPreviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pdfUrl = location.state?.pdfUrl;
  const [scale, setScale] = useState(1.0);

  return (
    <div className="flex flex-col h-screen bg-white p-8 relative">
      <header className="flex justify-between items-center mb-4">
        <h1 className="font-caprasimo text-2xl">PDF Preview</h1>
      </header>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col w-1/2">
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
      <div className="flex-1 flex justify-center items-center border rounded-lg shadow mb-4">
        {pdfUrl ? (
            <Document file={pdfUrl} className="flex justify-center mt-8 h-full text-gray-400">
              <Page pageNumber={1} scale={scale} />
            </Document>
          ) : (
            <p className="text-red-500">Cannot load file.</p>
          )}
      </div>

      {/* Back to Creator Button */}
      <div className="flex justify-center items-center relative mt-20">
      <button
        onClick={() => navigate('/creator')}
        className="absolute bottom-8 left-0 bg-blue-500 text-white py-2 px-8 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
        Back
      </button>
      </div>

    </div>
  );
};

export default PdfPreviewPage;
