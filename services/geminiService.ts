
import { GoogleGenAI, Type } from "@google/genai";

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Sebagai asisten ahli KALKUMATH, jelaskan langkah demi langkah penyelesaian ${type} untuk persoalan: ${expression}. 

Konteks Data: ${JSON.stringify(context)}.

ATURAN FORMAT OUTPUT:
1. Mulailah dengan paragraf ringkasan konsep (2-3 kalimat).
2. Tampilkan langkah-langkah dengan format persis: "LANGKAH X: [JUDUL]" di awal baris baru untuk setiap langkah.
3. JANGAN gunakan tanda bintang (**) pada teks "LANGKAH X:".
4. PENTING: Gunakan tanda dollar ($) untuk SEMUA rumus matematika (contoh: $f(x) = x^2$ atau $\\frac{a}{b}$).
5. Gunakan Bahasa Indonesia yang akademis namun ramah.`
        }]
      }],
    });

    return response.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Terjadi masalah koneksi ke server AI. Mohon cek kembali koneksi internet Anda.";
  }
};

export const generateQuizQuestions = async (): Promise<any[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const randomSeed = Math.random().toString(36).substring(7);

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{ 
          text: `Buatkan 5 soal kuis kalkulus tingkat universitas yang UNIK. 
          Topik acak: Bilangan Real, Limit, Turunan, Integral.
          ID Sesi: ${randomSeed}
          
          ATURAN:
          1. WAJIB membungkus SEMUA rumus dengan tanda dollar tunggal ($...$).
          2. Pembahasan dalam Bahasa Indonesia.` 
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
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error("Quiz Error:", e);
    return [];
  }
};
