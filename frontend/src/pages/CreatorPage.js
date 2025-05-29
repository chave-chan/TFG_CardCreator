import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generatePdf } from "../services/apiService";
import {
  Button,
  CardPreview,
  ColorPicker,
  FileInput,
  FontSelector,
  TextInput,
} from "../components";
import Papa from "papaparse";

const CreatorPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [cardType, setCardType] = useState("");
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardQuantity, setCardQuantity] = useState("1");
  const [textFont, setTextFont] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [textAlign, setTextAlign] = useState("center");
  const [textJustify, setTextJustify] = useState("center");
  const [cardBackground, setCardBackground] = useState(null);
  //const [cardBack, setCardBack] = useState(null);
  const [cards, setCards] = useState([]);
  const [activeView, setActiveView] = useState("preview");

  const navigate = useNavigate();

  const addCard = () => {
    const cardQuantityNumber = parseInt(cardQuantity, 10) || 1;
    const newCard = {
      cardType,
      cardTitle,
      cardDescription,
      cardQuantity: cardQuantityNumber,
      textFont,
      textColor,
      textAlign,
      textJustify,
      cardBackground,
      //cardBack,
    };
    const newCards = Array.from({ length: cardQuantityNumber }, () => ({ ...newCard }));
    setCards(prev => [...prev, newCard]);
    setCardType("");
    setCardTitle("");
    setCardDescription("");
    setCardQuantity("1");
    setTextFont("Arial");
    setTextColor("#000000");
    setTextAlign("center");
    setTextJustify("center");
    setCardBackground(null);
    //setCardBack(null);
  };

  const isAddDisabled = (!csvFile && !cardBackground) || (!cardType.trim() && !cardTitle.trim() && !cardDescription.trim() && !cardBackground);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const csvCards = result.data.map((row) => ({
          cardType: row.type,
          cardTitle: row.title,
          cardDescription: row.text,
          cardQuantity: row.quantity,
        }));
        setCards(csvCards);
      },
      error: (error) =>
        console.error("Error processing the CSV file:", error),
    });
  };

  const handleGeneratePdf = async () => {
    if (cards.length === 0) return;

    const csvData = cards.map(card => ({
      type: card.cardType,
      title: card.cardTitle,
      text: card.cardDescription,
      quantity: parseInt(card.cardQuantity, 10) || 1,
    }))

    const csvContent = Papa.unparse(csvData);
    const csvBlob = new Blob([csvContent], { type: "text/csv" });
    const csvFile = new File([csvBlob], "cards.csv", { type: "text/csv" });

    const formData = new FormData();
    formData.append("csv", csvFile);
    cards.forEach((card, i) => {
      formData.append("background", card.cardBackground, card.cardBackground.name);
    });

    try {
      // Call the API to generate the PDF
      const pdfBlob = await generatePdf(formData, textAlign, textJustify, textColor);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      navigate("/pdf-preview", { state: { pdfUrl } });
    } catch (error) {
      console.error("Error generating the PDF:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Left Column - Creator */}
      <div className="w-1/2 bg-white p-8 flex flex-col h-full">
      <div>
        <h1 className="font-caprasimo text-3xl mb-4">Creator</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
          Upload a CSV file with all your cards
          <div className="relative group ml-2">
            <div className="flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-xs font-bold text-gray-700 cursor-pointer">
              i
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-200 text-black text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
              The CSV must have the fields: type, title, text, and quantity.
            </div>
          </div>
        </h2>
      </div>
        <div className="space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-gray-700 mb-1">CSV file</label>
            <FileInput onChange={handleCsvUpload} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              or Create them manually
            </h2>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Card Type</label>
              <input
                type="text"
                value={cardType}
                onChange={(e) => {
                  setCardType(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter card type"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 mb-1">Card Quantity</label>
              <input
                type="number"
                min="1"
                value={cardQuantity}
                onChange={(e) => {
                 setCardQuantity(e.target.value);
               }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="Enter card quantity"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => {
               setCardTitle(e.target.value);
             }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter card title"
            />
          </div>

          <div>
            <label className="block text-gray-700">Card Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => {
               setCardDescription(e.target.value);
             }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200 resize-none"
              placeholder="Enter card description"
              rows="4"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
              Card Settings
              <div className="relative group ml-2">
                <div className="flex items-center justify-center w-5 h-5 bg-gray-200 rounded-full text-xs font-bold text-gray-700 cursor-pointer">
                  i
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-200 text-black text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  The Card Background image must be SVG file.
                </div>
              </div>
            </h2>
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

            <div className="w-1/2">
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

          <div className="flex items-center space-x-8 w-full">
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

            <div className="w-1/2">
              <div className="w-1/4">
                <label className="block text-gray-700 mb-1">Text Color</label>
                <ColorPicker
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Card Background</label>
            <FileInput onChange={(e) => setCardBackground(e.target.files[0])} />
          </div>

          {/* <div>
            <label className="block text-gray-700 mb-1">Card Back</label>
            <FileInput onChange={(e) => setCardBack(e.target.files[0])} />
          </div> */}

          {/* Add Card Button */}
          <div className="flex justify-end mt-auto">
            <Button onClick={addCard} disabled={isAddDisabled}>
              Add Card
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="w-1/2 bg-gray-100 p-8 h-full flex flex-col min-h-0">
        <div>
          <h1 className="font-caprasimo text-3xl mb-4">Summary</h1>
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
        </div>

        {/* Conditionally render based on activeView */}
        <div className="flex-1 flex flex-col mt-4 min-h-0">
          {activeView === "preview" ? (
            <div className="flex-1 flex items-center justify-center min-h-0">
              {cards.length > 0 && <CardPreview card={cards[cards.length - 1]} />}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto mt-4">
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
        </div>
        
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
