import { GoogleGenAI, Type } from "@google/genai";
import { GridSize } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExplanation = async (topic: string, gridSize: GridSize): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "请检查 API Key 设置。";

  try {
    const prompt = `
      你需要向中国的小学四年级学生（约10岁）解释计算机科学概念。
      
      当前的主题是：${topic}
      当前的网格大小是：${gridSize}x${gridSize}
      
      请用生动、有趣、简单的语言解释。可以使用比喻（例如：电灯开关、排队的小兵）。
      解释要短小精悍，不要超过3段话。
      
      如果主题是“分辨率”或“信息量”，请重点讲解为什么 ${gridSize}x${gridSize} 的网格比小网格能画出更清晰的图，但需要的“0和1”也更多。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "魔法师正在思考中...";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "魔法师好像睡着了，请稍后再试。";
  }
};