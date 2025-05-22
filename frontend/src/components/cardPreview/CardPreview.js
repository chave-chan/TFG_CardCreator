import React, { useState, useEffect } from "react";
import { previewCard as fetchPreview } from "../../services/apiService";

const CardPreview = ({ card }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
  const loadPreview = async () => {
      if (!card) return;
      try {
        const payload = {
          type: card.cardType,
          title: card.cardTitle,
          text: card.cardDescription,
          text_align: card.textAlign,
          text_justify: card.textJustify,
          text_color: card.textColor,
        };
        console.log("Preview payload:", payload); // TESTING
        const data = await fetchPreview(payload);
        console.log("Preview data:", data); // TESTING
        setPreviewUrl(data.image);
      } catch (error) {
        console.error("Error getting the card preview:", error);
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
