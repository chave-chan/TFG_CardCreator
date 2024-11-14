import React, { useState, useEffect } from "react";
import { previewCard } from "../../services/apiService";

const CardPreview = ({ card }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const loadPreview = async () => {
      if (card) {
        try {
          const url = await previewCard(card);
          setPreviewUrl(url);
        } catch (error) {
          console.error("Error getting the card preview:", error);
        }
      }
    };
    loadPreview();
  }, [card]);

  return (
    <div className="flex-1 flex items-center justify-center">
      {previewUrl ? (
        <img src={previewUrl} alt="Previsualización de la Carta" className="w-2/4 h-3/4 bg-white rounded-lg shadow-md" />
      ) : (
        <div className="w-2/4 h-3/4 bg-white rounded-lg shadow-md flex items-center justify-center">
          <p className="text-gray-500">Card Preview</p>
        </div>
      )}
    </div>
  );
};

export default CardPreview;
