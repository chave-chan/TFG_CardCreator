import React, { useState, useEffect } from "react";
import { previewCard } from "../../services/apiService";

const CardPreview = ({ card }) => {
  const {
    cardType,
    cardTitle,
    cardDescription,
    textAlign,
    textJustify,
    textColor,
    cardBackground
  } = card || {};
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const loadPreview = async () => {
      if (!cardType || !cardTitle || !cardDescription || !cardBackground) {
        setPreviewUrl(null);
        return;
      }
      setLoading(true);
      try {
        const payload = {
          type: cardType,
          title: cardTitle,
          text: cardDescription,
          text_align: textAlign,
          text_justify: textJustify,
          text_color: textColor,
          svgFile: cardBackground,
        };
        const data = await previewCard(payload);
        setPreviewUrl(data.image);
      } catch (error) {
        console.error("Error getting the card preview:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPreview();
  }, [cardType, cardTitle, cardDescription, textAlign, textJustify, textColor, cardBackground]);

  return (
    <div className="flex-1 flex items-center justify-center">
      {loading ? (
        <div className="flex items-center justify-center">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-gray-200"></div>
         </div>
      ) : previewUrl ? (
          <img src={previewUrl} alt="Card Preview" className="w-2/4 h-3/4 bg-white rounded-lg shadow-md" />
      ) : (
        <div className="w-2/4 h-3/4 bg-white rounded-lg shadow-md flex items-center justify-center">
          <p className="text-gray-500">Card Preview</p>
        </div>
      )}
    </div>
  );
};

export default CardPreview;
