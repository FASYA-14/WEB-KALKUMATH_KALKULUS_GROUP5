
import { GoogleGenAI, Type } from "@google/genai";

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Sebagai asisten ahli KALKUMATH, jelaskan langkah demi langkah penyelesaian ${type} untuk: ${expression}. 
          
          Konteks Data: ${JSON.stringify(context)}.
          
          ATURAN:
          1. Gunakan Bahasa Indonesia yang ramah (seperti dosen ke mahasiswa).
          2. Gunakan LaTeX untuk SEMUA rumus matematika (bungkus dengan $ untuk inline atau $$ untuk blok).
          3. Berikan penjelasan yang mendalam namun mudah dipahami.
          4. Fokus pada konsep fundamental.`
        }]
      }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan ekspresi matematika Anda benar.";
  }
};

export const generateQuizQuestions = async (): Promise<any[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{ 
          text: "Buatkan 5 soal kuis kalkulus tingkat universitas yang menantang. Sertakan topik Bilangan Real, Limit, Turunan, dan Integral. Setiap soal harus memiliki 4 pilihan jawaban, 1 kunci jawaban, dan pembahasan mendalam dalam LaTeX." 
        }]
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

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to generate quiz questions", e);
    // Kembalikan soal fallback jika API gagal
    return [
      {
        id: 1,
        category: "Limit",
        question: "Berapakah nilai dari $\\lim_{x \\to 0} \\frac{\\sin(x)}{x}$?",
        options: ["0", "1", "$\infty$", "Tidak ada"],
        correctAnswer: "1",
        explanation: "Berdasarkan teorema limit trigonometri dasar, $\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$."
      }
    ];
  }
};
