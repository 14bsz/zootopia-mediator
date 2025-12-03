import { UserInput, MediationResult } from "../types";

const GLM_API_KEY = (process.env.GLM_API_KEY || process.env.GEMINI_API_KEY || '').trim();

const buildPrompt = (inputA: UserInput, inputB: UserInput) => `你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。仅使用简体中文输出所有内容，不得出现英文。当事人 A（${inputA.name}）的陈述："${inputA.description}"。诉求："${inputA.demand}"。当事人 B（${inputB.name}）的陈述："${inputB.description}"。诉求："${inputB.demand}"。任务要求：1) 由朱迪进行逻辑清晰、公正积极的分析；2) 由尼克进行幽默机智、略带调侃但具建设性的点评；3) 给出双方责任百分比，总和必须为 100%；4) 分别给出对 A 与 B 的具体改进建议；5) 生成 5 条可执行的和解行动建议，需带动物城风格，并确保都是中文短句。人设语气：朱迪富有正义感且积极；尼克淡定、风趣、偶尔挖苦但不伤人。请严格只输出 JSON，字段为：judyAnalysis(string)、nickComment(string)、responsibility(object{partyA:int,partyB:int})、adviceForA(string)、adviceForB(string)、reconciliationPlan(string[5])、synergyScoreChange(int，范围 -20 到 -2)。不得输出任何多余文本。`;

export const analyzeDispute = async (inputA: UserInput, inputB: UserInput): Promise<MediationResult> => {
  if (!GLM_API_KEY) {
    throw new Error("缺少智谱 GLM API 密钥。请在环境变量中设置 GLM_API_KEY。");
  }

  const body = {
    model: "glm-4-flash",
    messages: [
      { role: "system", content: "你是朱迪与尼克的联合 AI 调解员。所有输出必须为简体中文。严格按要求以纯 JSON 返回结果，不要附加解释。" },
      { role: "user", content: buildPrompt(inputA, inputB) }
    ],
    temperature: 0.7,
    stream: false
  };

  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GLM_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "GLM API 请求失败");
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";
  const parsed = JSON.parse(content);
  return parsed as MediationResult;
};
