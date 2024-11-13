const API_BASE_URL = "http://localhost:8000/api/v1"; // Backend API URL

export const loginWithGoogle = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.detail || "Error en la autenticación con Google");
        }
        return data;
    } catch (error) {
        console.error("Error al autenticar con Google:", error);
        throw error;
    }
};

export const getCards = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cards`);
        if (!response.ok) {
            throw new Error("Error al obtener las cartas");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener las cartas:", error);
        throw error;
    }
};

export const generatePdf = async (csvFilePath) => {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/generate-pdf`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ csv_file_path: csvFilePath }),
        });
        if (!response.ok) {
            throw new Error("Error al generar el PDF");
        }
        const data = await response.blob();
        return data; // Returns blob
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        throw error;
    }
};
