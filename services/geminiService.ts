import { UserInput, MediationResult } from "../types";

const buildPrompt = (inputA: UserInput, inputB: UserInput) => `你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。仅使用简体中文输出所有内容，不得出现英文。绝对禁止以“A/B”指代双方，必须直接使用其姓名或昵称（如：${inputA.name || '甲方'}、${inputB.name || '乙方'}）。当事人 ${inputA.name} 的陈述:"${inputA.description}"；诉求:"${inputA.demand}"。当事人 ${inputB.name} 的陈述:"${inputB.description}"；诉求:"${inputB.demand}"。任务要求：1) 朱迪的分析必须明确指出责任归属：直接说明谁为主责、谁为次责，并给出清晰理由；语气正义严谨、不近人情；篇幅充实（不少于 200 字）。2) 尼克的锐评必须提出具体建议与改进措施：在接受已明确的责任基础上，用圆滑幽默的方式缓和气氛，给出可执行的劝解建议；篇幅充实（不少于 180 字）。3) 给出双方责任百分比，总和必须为 100%。4) 分别给出对 ${inputA.name} 与 ${inputB.name} 的具体改进建议：至少 5 条，使用分号分隔为一个字符串，句式短而可执行。5) 生成 5 条可执行的和解行动建议，需带动物城风格，并确保都是中文短句（每条不少于 15 字）。角色语气：朱迪非常有正义感、不近人情；尼克非常圆滑、风趣，能在明确责任后起到缓和作用。整体风格必须符合《疯狂动物城》，生动有趣。请严格只输出 JSON，字段为：judyAnalysis(string)、nickComment(string)、responsibility(object{partyA:int,partyB:int})、adviceForA(string)、adviceForB(string)、reconciliationPlan(string[5])、synergyScoreChange(int，范围 -20 到 -2)。不得输出任何多余文本。`;

export const analyzeDispute = async (inputA: UserInput, inputB: UserInput): Promise<MediationResult> => {
  let res = await fetch("/.netlify/functions/glmAnalyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputA, inputB })
  }).catch(() => undefined as any);

  if (!res || !res.ok) {
    res = await fetch("/api/glmAnalyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputA, inputB })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "GLM 代理请求失败");
    }
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "";
  const raw = content.trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(raw) as MediationResult;
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = raw.slice(start, end + 1);
      return JSON.parse(slice) as MediationResult;
    }
    throw new Error("GLM 返回非 JSON 格式");
  }
};
