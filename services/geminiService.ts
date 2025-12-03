import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserInput, MediationResult } from "../types";

const GENAI_API_KEY = process.env.GEMINI_API_KEY || '';

// Define the response schema for structured output
const mediationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    judyAnalysis: {
      type: Type.STRING,
      description: "朱迪的分析，逻辑清晰、公正积极。请使用简体中文。",
    },
    nickComment: {
      type: Type.STRING,
      description: "尼克的点评，幽默机智、略带调侃但建设性。请使用简体中文。",
    },
    responsibility: {
      type: Type.OBJECT,
      properties: {
        partyA: { type: Type.INTEGER, description: "当事人 A 的责任百分比 (0-100)" },
        partyB: { type: Type.INTEGER, description: "当事人 B 的责任百分比 (0-100)" },
      },
      required: ["partyA", "partyB"],
    },
    adviceForA: { type: Type.STRING, description: "给当事人 A 的改进建议（简体中文）。" },
    adviceForB: { type: Type.STRING, description: "给当事人 B 的改进建议（简体中文）。" },
    reconciliationPlan: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 条实用、带动物城风格的中文和解行动建议。",
    },
    synergyScoreChange: {
      type: Type.INTEGER,
      description: "根据严重程度对默契值的影响，范围 -20 到 -2。",
    }
  },
  required: ["judyAnalysis", "nickComment", "responsibility", "adviceForA", "adviceForB", "reconciliationPlan", "synergyScoreChange"],
};

export const analyzeDispute = async (inputA: UserInput, inputB: UserInput): Promise<MediationResult> => {
  if (!GENAI_API_KEY) {
    throw new Error("缺少 Gemini API 密钥。请在环境变量中设置 GEMINI_API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: GENAI_API_KEY });

  const promptText = `
    你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。

    仅使用简体中文输出所有内容，不得出现英文。

    当事人 A（${inputA.name}）的陈述："${inputA.description}"。诉求："${inputA.demand}"。
    当事人 B（${inputB.name}）的陈述："${inputB.description}"。诉求："${inputB.demand}"。

    任务要求：
    1) 由朱迪进行逻辑清晰、公正积极的分析；
    2) 由尼克进行幽默机智、略带调侃但具建设性的点评；
    3) 给出双方责任百分比，总和必须为 100%；
    4) 分别给出对 A 与 B 的具体改进建议；
    5) 生成 5 条可执行的和解行动建议，需带动物城风格（例如：爪爪冰棍、树懒、主题曲元素等），并确保都是中文短句（不得出现英文）。

    人设语气：朱迪富有正义感且积极；尼克淡定、风趣、偶尔挖苦但不伤人。
  `;

  const parts: any[] = [{ text: promptText }];

  // Add images if available (Multimodal)
  if (inputA.imageBase64) {
    parts.push({
        inlineData: {
            mimeType: "image/jpeg",
            data: inputA.imageBase64.split(',')[1] // Remove data URL prefix
        }
    });
    parts.push({ text: `以上图片由当事人 ${inputA.name} 提供，作为证据参考。` });
  }
  if (inputB.imageBase64) {
    parts.push({
        inlineData: {
            mimeType: "image/jpeg",
            data: inputB.imageBase64.split(',')[1]
        }
    });
    parts.push({ text: `以上图片由当事人 ${inputB.name} 提供，作为证据参考。` });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: mediationSchema,
        systemInstruction: "你是朱迪与尼克的联合 AI 调解员。所有输出必须为简体中文，不得出现英文或拼音。保持角色风格与温度，给出结构化、公正且可执行的建议。",
        temperature: 0.7,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MediationResult;
    } else {
      throw new Error("No response content generated.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
