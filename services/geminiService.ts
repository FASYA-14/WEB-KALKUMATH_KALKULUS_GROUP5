
import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = () => {
  return (window as any).process?.env?.API_KEY || (process?.env?.API_KEY) || "";
};

export const getMathExplanation = async (type: string, expression: string, context: any) => {
  try {
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Sebagai asisten ahli KALKUMATH, jelaskan langkah demi langkah penyelesaian ${type} untuk persoalan: ${expression}. 
          
          Konteks Data: ${JSON.stringify(context)}.
          
          ATURAN FORMAT OUTPUT:
          1. Mulailah dengan paragraf ringkasan konsep (2-3 kalimat).
          2. Gunakan format "Langkah X: [Judul Langkah]" diikuti penjelasannya untuk setiap tahapan.
          3. Gunakan LaTeX untuk SEMUA rumus matematika (bungkus dengan $ untuk inline atau $$ untuk blok).
          4. Gunakan Bahasa Indonesia yang akademis namun ramah.
          5. Pastikan penjelasan fokus pada "mengapa" langkah tersebut diambil.`
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
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    const randomSeed = Math.random().toString(36).substring(7);
    const timestamp = new Date().getTime();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{ 
          text: `Buatkan 5 soal kuis kalkulus tingkat universitas (semester 1-2) yang UNIK dan BERBEDA dari sebelumnya. 
          Gunakan variasi angka dan skenario kasus yang beragam.
          Topik yang harus ada: Bilangan Real, Limit (trigonometri/tak hingga), Turunan (rantai/implisit), dan Integral (substitusi/parsial).
          ID Sesi: ${randomSeed}-${timestamp}
          
          ATURAN:
          1. Setiap soal harus memiliki 4 pilihan jawaban yang masuk akal.
          2. Sertakan pembahasan mendalam dalam LaTeX.
          3. Gunakan Bahasa Indonesia.` 
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
    return [
      {
        id: 1,
        category: "Limit",
        question: "Berapakah nilai dari $\\lim_{x \\to 0} \\frac{\\tan(2x)}{x}$?",
        options: ["0", "1", "2", "$\\infty$"],
        correctAnswer: "2",
        explanation: "Menggunakan sifat limit trigonometri $\\lim_{x \\to 0} \\frac{\\tan(ax)}{bx} = \\frac{a}{b}$, maka hasilnya adalah 2."
      }
    ];
  }
};
