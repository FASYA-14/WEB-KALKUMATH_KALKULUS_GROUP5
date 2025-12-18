
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with the direct process.env.API_KEY variable as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  // Use ai.models.generateContent and await the result directly
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Sebagai asisten KalkuMath, jelaskan langkah demi langkah penyelesaian ${type} untuk: ${expression}. 
    Konteks tambahan: ${JSON.stringify(context)}.
    Berikan penjelasan dalam bahasa Indonesia yang ramah untuk mahasiswa semester 1. 
    Gunakan format LaTeX untuk rumus (bungkus dengan $ atau $$). 
    Fokus pada konsep dasar dan aturan yang digunakan.`,
  });

  // Extract generated text from the .text property (not a method)
  return response.text;
};

export const generateQuizQuestions = async (): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Buatkan 5 soal kuis kalkulus variatif (Bilangan Real, Limit, Turunan, Integral). Berikan dalam format JSON murni.",
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

  try {
    // Use .text property to access the response content
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse quiz questions", e);
    return [];
  }
};
