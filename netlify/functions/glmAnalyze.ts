import type { Handler } from "@netlify/functions";

interface BodyInput {
  inputA: any;
  inputB: any;
}

const buildPrompt = (inputA: any, inputB: any) => `你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。仅使用简体中文输出所有内容，不得出现英文。绝对禁止以“A/B”指代双方，必须直接使用其姓名或昵称（如：${inputA.name || '甲方'}、${inputB.name || '乙方'}）。当事人 ${inputA.name} 的陈述:"${inputA.description}"；诉求:"${inputA.demand}"。当事人 ${inputB.name} 的陈述:"${inputB.description}"；诉求:"${inputB.demand}"。任务要求：1) 朱迪的分析必须明确指出责任归属：直接说明谁为主责、谁为次责，并给出清晰理由；语气正义严谨、不近人情；篇幅充实（不少于 200 字）。2) 尼克的锐评必须提出具体建议与改进措施：在接受已明确的责任基础上，用圆滑幽默的方式缓和气氛，给出可执行的劝解建议；篇幅充实（不少于 180 字）。3) 给出双方责任百分比，总和必须为 100%。4) 分别给出对 ${inputA.name} 与 ${inputB.name} 的具体改进建议：至少 5 条，使用分号分隔为一个字符串，句式短而可执行。5) 生成 5 条可执行的和解行动建议，并确保都是中文短句（每条不少于 15 字）。角色语气：朱迪非常有正义感、不近人情；尼克非常圆滑、风趣，能在明确责任后起到缓和作用。整体风格必须符合《疯狂动物城》，生动有趣。请严格只输出 JSON，字段为：judyAnalysis(string)、nickComment(string)、responsibility(object{partyA:int,partyB:int})、adviceForA(string)、adviceForB(string)、reconciliationPlan(string[5])、synergyScoreChange(int，范围 -20 到 -2)。不得输出任何多余文本。`;

export const handler: Handler = async (event) => {
  const apiKey = (process.env.GLM_API_KEY || "").trim();
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "GLM_API_KEY 未配置" })
    };
  }

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: ""
    };
  }

  try {
    const parsed: BodyInput = JSON.parse(event.body || "{}");
    const { inputA, inputB } = parsed;

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
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    const text = await res.text();
    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        body: text
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: text
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err?.message || "内部错误" })
    };
  }
};
