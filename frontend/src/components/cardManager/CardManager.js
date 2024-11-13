import React, { useEffect, useState } from "react";
import { getCards, generatePdf } from "../../services/apiService.js";

const CardManager = () => {
    const [cards, setCards] = useState([]);
    const [pdfBlob, setPdfBlob] = useState(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const data = await getCards();
                setCards(data);
            } catch (error) {
                console.error("Error al cargar las cartas:", error);
            }
        };
        fetchCards();
    }, []);

    const handleGeneratePdf = async () => {
        try {
            const pdfBlob = await generatePdf("csvpath.csv"); // CHANGE THIS TO THE CORRECT FILE PATH
            setPdfBlob(pdfBlob);

            // Create a URL for the PDF blob
            const url = URL.createObjectURL(pdfBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "cards.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating the PDF:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">Card List</h1>
            <ul className="mb-4">
                {cards.map((card) => (
                    <li key={card.id} className="text-gray-800">
                        {card.title}
                    </li>
                ))}
            </ul>
            <button
                onClick={handleGeneratePdf}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Generate PDF
            </button>
        </div>
    );
};

export default CardManager;