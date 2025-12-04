import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const glmProxyPlugin = {
    name: 'glm-proxy',
    configureServer(server: any) {
      const handler = async (req: any, res: any) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
          res.end('');
          return;
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }
        let bodyStr = '';
        await new Promise<void>((resolve) => {
          req.on('data', (chunk: any) => { bodyStr += chunk; });
          req.on('end', () => resolve());
        });
        let parsed: any = {};
        try { parsed = JSON.parse(bodyStr || '{}'); } catch {}
        const { inputA, inputB } = parsed || {};
        const apiKey = (env.GLM_API_KEY || process.env.GLM_API_KEY || '').trim();
        if (!apiKey) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ error: 'GLM_API_KEY 未配置' }));
          return;
        }
        const buildPrompt = (a: any, b: any) => `你将扮演《疯狂动物城》的朱迪与尼克担任调解员，以幽默且温暖的方式进行评理。仅使用简体中文输出所有内容，不得出现英文。当事人 A（${a?.name}）的陈述:"${a?.description}"。诉求:"${a?.demand}"。当事人 B（${b?.name}）的陈述:"${b?.description}"。诉求:"${b?.demand}"。任务要求：1) 由朱迪进行逻辑清晰、公正积极的分析；2) 由尼克进行幽默机智、略带调侃但具建设性的点评；3) 给出双方责任百分比，总和必须为 100%；4) 分别给出对 A 与 B 的具体改进建议；5) 生成 5 条可执行的和解行动建议，并确保都是中文短句。请严格只输出 JSON，字段为：judyAnalysis(string)、nickComment(string)、responsibility(object{partyA:int,partyB:int})、adviceForA(string)、adviceForB(string)、reconciliationPlan(string[5])、synergyScoreChange(int，范围 -20 到 -2)。不得输出任何多余文本。`;
        const upstreamBody = {
          model: 'glm-4-flash',
          messages: [
            { role: 'system', content: '你是朱迪与尼克的联合 AI 调解员。所有输出必须为简体中文。严格按要求以纯 JSON 返回结果，不要附加解释。' },
            { role: 'user', content: buildPrompt(inputA, inputB) }
          ],
          temperature: 0.7,
          stream: false
        };
        let upstream: any;
        try {
          upstream = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify(upstreamBody)
          });
        } catch {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ error: '上游连接失败' }));
          return;
        }
        const text = await upstream.text();
        res.statusCode = upstream.status;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(text);
      };
      server.middlewares.use('/api/glmAnalyze', handler);
      server.middlewares.use('/.netlify/functions/glmAnalyze', handler);
    }
  };
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), glmProxyPlugin],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
