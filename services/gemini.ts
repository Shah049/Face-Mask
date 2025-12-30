
import { GoogleGenAI, Type } from "@google/genai";
import { MaskStatus, DetectionResult } from "../types";

export const detectMaskFromImage = async (base64Image: string): Promise<DetectionResult> => {
  try {
    // Re-initialize client before each call to ensure the latest API key is utilized
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: "COMPUTER VISION TASK: Analyze this surveillance frame. Detect all faces and identify if they are wearing a safety mask correctly ('Mask') or not ('No Mask'). Provide normalized bounding boxes [ymin, xmin, ymax, xmax] from 0-1000. Output JSON ONLY.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faces: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  status: { type: Type.STRING },
                  confidence: { type: Type.NUMBER },
                  box: {
                    type: Type.OBJECT,
                    properties: {
                      ymin: { type: Type.INTEGER },
                      xmin: { type: Type.INTEGER },
                      ymax: { type: Type.INTEGER },
                      xmax: { type: Type.INTEGER },
                    },
                    required: ["ymin", "xmin", "ymax", "xmax"]
                  }
                },
                required: ["status", "confidence", "box"]
              }
            }
          },
          required: ["faces"]
        },
      },
    });

    const data = JSON.parse(response.text || '{"faces": []}');
    
    return {
      faces: data.faces.map((f: any) => ({
        status: f.status === 'Mask' ? MaskStatus.MASK : MaskStatus.NO_MASK,
        confidence: f.confidence,
        box: f.box
      })),
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Vision Engine Error:", error);
    // Handle "Entity not found" error by potentially prompting re-selection
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
      window.dispatchEvent(new CustomEvent('vision-engine-auth-error'));
    }
    return {
      faces: [],
      timestamp: Date.now(),
      message: "Vision engine disconnected. Check connection."
    };
  }
};
