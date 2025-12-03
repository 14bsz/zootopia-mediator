import type { Handler } from "@netlify/functions";

interface BodyInput {
  inputA: any;
  inputB: any;
}

const buildPrompt = (inputA: any, inputB: any) => `你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。仅使用简体中文输出所有内容，不得出现英文。当事人 A（${inputA.name}）的陈述:"${inputA.description}"。诉求:"${inputA.demand}"。当事人 B（${inputB.name}）的陈述:"${inputB.description}"。诉求:"${inputB.demand}"。任务要求：1) 由朱迪进行逻辑清晰、公正积极的分析；2) 由尼克进行幽默机智、略带调侃但具建设性的点评；3) 给出双方责任百分比，总和必须为 100%；4) 分别给出对 A 与 B 的具体改进建议；5) 生成 5 条可执行的和解行动建议，并确保都是中文短句。请严格只输出 JSON，字段为：judyAnalysis(string)、nickComment(string)、responsibility(object{partyA:int,partyB:int})、adviceForA(string)、adviceForB(string)、reconciliationPlan(string[5])、synergyScoreChange(int，范围 -20 到 -2)。不得输出任何多余文本。`;

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

