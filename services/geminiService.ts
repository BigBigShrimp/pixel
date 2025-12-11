import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (topic: string, gridSize: number): Promise<string> => {
  try {
    const prompt = `
      你是一位亲切的小学信息科技老师。
      请给四年级的小学生解释一下：当图像的分辨率为 ${gridSize}x${gridSize} 时，
      关于"${topic}"的知识。
      
      要求：
      1. 语言通俗易懂，多用比喻。
      2. 字数控制在 100 字以内。
      3. 语气要活泼有趣。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "魔法师正在休息，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "魔法师现在的信号不太好，请稍后再试哦！";
  }
};