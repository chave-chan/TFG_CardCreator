import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePdf } from "../services/apiService";
import {
  Button,
  CardPreview,
  ColorPicker,
  FileInput,
  fontSelector,
  TextInput,
} from "../components";
import Papa from "papaparse";

const CreatorPage = () => {
  const [cardType, setCardType] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [textFont, setTextFont] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState("center");
  const [textJustify, setTextJustify] = useState("center");
  const [cardBackground, setCardBackground] = useState(null);
  const [cardBack, setCardBack] = useState(null);
  const [cards, setCards] = useState([]);
  const [activeView, setActiveView] = useState("preview");

  const navigate = useNavigate();

  const addCard = () => {
    const newCard = {
      cardType,
      cardTitle,
      cardDescription,
      textFont,
      textColor,
      textAlign,
      textJustify,
      cardBackground,
      cardBack,
    };
    setCards([...cards, newCard]);
    // Clear form
    setCardType("");
    setCardTitle("");
    setCardDescription("");
    setTextFont("Arial");
    setTextColor("#000000");
    setTextAlign("center");
    setTextJustify("center");
    setCardBackground(null);
    setCardBack(null);
  };

  const isAddDisabled =
    !cardType || !cardTitle || !cardDescription || !textFont || !textColor;

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const csvCards = result.data.map((row) => ({
          cardType: row.type,
          cardTitle: row.title,
          cardDescription: row.text,
          quantity: row.quantity,
        }));
        setCards(csvCards);
      },
      error: (error) =>
        console.error("Error al procesar el archivo CSV:", error),
    });
  };

  const handleGeneratePdf = async () => {
    if (cards.length === 0) return;

    const csvData = cards.map((card) => ({
      type: card.cardType,
      title: card.cardTitle,
      text: card.cardDescription,
      quantity: card.quantity || 1,
    }));

    const csvContent = Papa.unparse(csvData);
    const csvBlob = new Blob([csvContent], { type: "text/csv" });
    const csvFile = new File([csvBlob], "cards.csv", { type: "text/csv" });

    const formData = new FormData();
    formData.append("csv", csvFile);

    // Add card images to the form data
    cards.forEach((card, index) => {
      if (card.cardBackground) {
        formData.append(`cardBackground_${index}`, card.cardBackground);
      }
      if (card.cardBack) {
        formData.append(`cardBack_${index}`, card.cardBack);
      }
    });

    try {
      // Call the API to generate the PDF
      const pdfBlob = await generatePdf(formData);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      navigate("/pdf-preview", { state: { pdfUrl } });
    } catch (error) {
      console.error("Error generating the PDF:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Column - Creator */}
      <div className="relative w-1/2 bg-white p-8 flex flex-col h-full overflow-y-auto">
        <h1 className="font-caprasimo text-2xl mb-4">Creator</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Upload a CSV file with all your cards
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">CSV file</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="mb-4"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              or Create them manually
            </h2>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Type</label>
            <input
              type="text"
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter card type"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter card title"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 resize-none"
              placeholder="Enter card description"
              rows="4"
            />
          </div>

          <div className="flex items-center w-full space-x-8">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Text Alignment</label>
              <select
                value={textAlign}
                onChange={(e) => setTextAlign(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Text Justify</label>
              <select
                value={textJustify}
                onChange={(e) => setTextJustify(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Text Font</label>
              <select
                value={textFont}
                onChange={(e) => setTextFont(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option>Arial</option>
                <option>Courier New</option>
                <option>Times New Roman</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Text Color</label>
              <ColorPicker
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Background</label>
            <FileInput onChange={(e) => setCardBackground(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Back</label>
            <FileInput onChange={(e) => setCardBack(e.target.files[0])} />
          </div>

          {/* Add Card Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={addCard} disabled={isAddDisabled}>
              Add Card
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="w-1/2 bg-gray-100 p-8 h-full flex flex-col relative">
        <h1 className="font-caprasimo text-2xl mb-4">Summary</h1>
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveView("preview")}
            className={`pb-2 ${
              activeView === "preview"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`pb-2 ${
              activeView === "list"
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Cards List
          </button>
        </div>

        {/* Conditionally render based on activeView */}
        {activeView === "preview" ? (
          <div className="flex-1 flex items-center justify-center">
            <CardPreview card={cards[0]} />
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto mt-4">
            {cards.length > 0 ? (
              <ul className="space-y-2">
                {cards.map((card, index) => (
                  <li
                    key={index}
                    className="border p-4 rounded-lg bg-white shadow"
                  >
                    <h3 className="text-lg font-semibold">{card.cardTitle}</h3>
                    <p>{card.cardDescription}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center mt-4">
                No cards added yet.
              </p>
            )}
          </div>
        )}

        {/* Generate PDF Button */}
        <div className="flex justify-end mt-4">
          <Button disabled={cards.length === 0} onClick={handleGeneratePdf}>
            Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;
