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

export const previewCard = async ({ 
  type, title, text, text_align, text_justify, text_color, svgFile 
}) => {
  const form = new FormData();
  form.append("type",         type);
  form.append("title",        title);
  form.append("text",         text);
  form.append("text_align",   text_align);
  form.append("text_justify", text_justify);
  form.append("text_color",   text_color);
  form.append("svg_file",     svgFile, svgFile.name);

  const res = await fetch(`${API_BASE_URL}/cards/preview`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error getting the card preview");
  return data;
};

export const getCards = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/cards`);
        if (!response.ok) {
            throw new Error("Error getting the cards");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting the cards:", error);
        throw error;
    }
};

export const generatePdf = async (formData, textAlign, textJustify, textColor) => {
  const colorParam = textColor.replace("#", "");
  const res = await fetch(
    `${API_BASE_URL}/cards/generate-pdf?text_align=${textAlign}&text_justify=${textJustify}&text_color=${colorParam}`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Error ${res.status}: ${txt}`);
  }
  return res.blob();
};
