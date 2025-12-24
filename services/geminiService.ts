
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  // Mencoba berbagai cara akses API KEY yang mungkin di Vercel/Vite
  return (window as any).process?.env?.API_KEY || (process?.env?.API_KEY) || "";
};

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found");
    
    const ai = new GoogleGenAI({ apiKey });
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
4. PENTING: Gunakan tanda dollar ($) untuk SEMUA rumus matematika (contoh: $f(x) = x^2$). Untuk rumus besar gunakan double dollar ($$).
5. Gunakan Bahasa Indonesia yang akademis namun ramah.`
        }]
      }],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, terjadi kesalahan saat menghubungi server AI. Pastikan API KEY telah diatur dengan benar di dashboard Vercel.";
  }
};

export const generateQuizQuestions = async (): Promise<any[]> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found");

    const ai = new GoogleGenAI({ apiKey });
    const randomSeed = Math.random().toString(36).substring(7);
    const timestamp = new Date().getTime();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{ 
          text: `Buatkan 5 soal kuis kalkulus tingkat universitas (semester 1-2) yang UNIK dan BERBEDA. 
          Topik: Bilangan Real, Limit, Turunan, Integral.
          ID Sesi: ${randomSeed}-${timestamp}
          
          ATURAN KETAT:
          1. WAJIB membungkus SEMUA rumus matematika dengan tanda dollar tunggal ($...$).
          2. Pilihan jawaban harus singkat dan jika berupa matematika juga wajib dibungkus tanda dollar.
          3. Berikan pembahasan (explanation) yang mendalam menggunakan Bahasa Indonesia.` 
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
    return [];
  }
};
