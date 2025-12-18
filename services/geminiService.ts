
import { GoogleGenAI, Type } from "@google/genai";

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Sebagai asisten KALKUMATH, jelaskan langkah demi langkah penyelesaian ${type} untuk: ${expression}. 
          Konteks tambahan: ${JSON.stringify(context)}.
          Berikan penjelasan dalam bahasa Indonesia yang ramah untuk mahasiswa semester 1. 
          Gunakan format LaTeX untuk rumus (bungkus dengan $ atau $$). 
          Fokus pada konsep dasar dan aturan yang digunakan.`
        }]
      }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, penjelasan AI tidak dapat dimuat saat ini. Silakan periksa koneksi internet Anda atau coba lagi nanti.";
  }
};

export const generateQuizQuestions = async (): Promise<any[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{ text: "Buatkan 5 soal kuis kalkulus variatif (Bilangan Real, Limit, Turunan, Integral). Berikan dalam format JSON." }]
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "category", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse quiz questions", e);
    return [];
  }
};
