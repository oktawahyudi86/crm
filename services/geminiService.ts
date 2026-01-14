import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getGeminiClient = () => {
  // Ideally this comes from process.env.API_KEY, but for this demo context:
  // We assume the environment is set up correctly.
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStrategicAdvice = async (
  userPrompt: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    
    // Using gemini-3-flash-preview for quick, intelligent text responses
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history, // Pass conversation history for context
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I couldn't generate a strategic insight at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to connect to the Strategic Advisor. Please check your API key.";
  }
};