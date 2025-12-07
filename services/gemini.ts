import { GoogleGenAI } from "@google/genai";
import { Maxim, SearchResult, GroundingChunk } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const fetchBookMaxims = async (): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Search for the 12 key maxims (life lessons) from the book "Life Only Has One Thing" (人生只有一件事) by Jin Wei Chun (金惟純).
      The book is organized into maxims suitable for a calendar or list of 12 items.
      
      Please return the response strictly as a JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`).
      The JSON object must have a key "maxims" which is an array of 12 objects.
      Each object must have:
      - "title": The Chinese title of the maxim (e.g., "學怎麼聽").
      - "translation": An English translation of the title.
      - "description": A short, inspiring explanation (1-2 sentences) of the maxim in English.
      - "chineseDescription": A short, inspiring explanation (1-2 sentences) of the maxim in Traditional Chinese (繁體中文).
      
      If you cannot find exactly 12, find the most important ones and fill the rest with relevant wisdom from the same author/book to make 12.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    // Extract JSON from markdown
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let parsedData: { maxims: any[] } = { maxims: [] };

    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback attempt to parse raw text if no code blocks
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON from response text:", text);
        throw new Error("Could not parse book content.");
      }
    }

    const maxims: Maxim[] = parsedData.maxims.map((item: any, index: number) => ({
      id: index + 1,
      month: new Date(2026, index).toLocaleString('en-US', { month: 'long' }),
      title: item.title,
      translation: item.translation,
      description: item.description,
      chineseDescription: item.chineseDescription || item.description, // Fallback
    }));

    return { maxims, groundingChunks };

  } catch (error) {
    console.error("Error fetching maxims:", error);
    throw error;
  }
};

export const generateMaximIllustration = async (maxim: Maxim): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    // Strict prompt to avoid text and ensure style
    const prompt = `
      Create a traditional Zen ink wash painting (Sumi-e).
      The painting should be an abstract visual metaphor for: "${maxim.translation}".
      Concept description: "${maxim.description}".
      
      STRICT VISUAL RULES:
      1. DO NOT include any text, letters, characters, or words in the image. Pure visual art only.
      2. Style: Japanese Ink Wash (Sumi-e). Black ink on white paper.
      3. High contrast, minimalist, significant negative space.
      4. No colors. Grayscale/Black & White only.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      }
    });

    // Check for image parts
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    // Log if no image found but text was returned (debugging)
    const textPart = parts.find(p => p.text);
    if (textPart) {
        console.warn("Model returned text instead of image:", textPart.text);
    }
    
    // Returning empty string signals failure to the caller
    return ""; 

  } catch (error) {
    console.error("Error generating illustration:", error);
    return ""; 
  }
};