import express from 'express';
import { createServer as createViteServer } from 'vite';
import { put } from '@vercel/blob';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure local uploads directory exists for preview fallback when BLOB_READ_WRITE_TOKEN is not set
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Raw body parser for /api/blob binary uploads (up to 100MB for product videos/photos/PDFs)
  app.post(
    '/api/blob',
    express.raw({ type: '*/*', limit: '100mb' }),
    async (req, res) => {
      try {
        const rawFilename = (req.query.filename as string) || `wox-asset-${Date.now()}`;
        const safeFilename = `${Date.now()}-${rawFilename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const contentType = (req.headers['content-type'] as string) || 'application/octet-stream';
        const headerToken = req.headers['x-blob-token'] as string | undefined;
        const token = headerToken || process.env.BLOB_READ_WRITE_TOKEN;

        const bodyBuffer = Buffer.isBuffer(req.body)
          ? req.body
          : Buffer.from(req.body || '');

        if (token && token.trim().length > 10) {
          try {
            const blob = await put(`wox-faber/${safeFilename}`, bodyBuffer, {
              access: 'public',
              contentType,
              token: token.trim(),
              addRandomSuffix: true,
            });
            res.status(200).json({
              url: blob.url,
              pathname: blob.pathname,
              provider: 'vercel-blob',
            });
            return;
          } catch (blobErr) {
            console.warn('Vercel Blob put failed, falling back to local static storage:', blobErr);
          }
        }

        // Local static fallback so preview works immediately even before adding BLOB_READ_WRITE_TOKEN
        const filePath = path.join(uploadsDir, safeFilename);
        fs.writeFileSync(filePath, bodyBuffer);

        res.status(200).json({
          url: `/uploads/${safeFilename}`,
          pathname: `uploads/${safeFilename}`,
          provider: 'vercel-blob-ready-local',
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload error';
        res.status(500).json({ error: message });
      }
    }
  );

  // Virtual Assistant Chat Endpoint using @google/genai (gemini-3.8-flash)
  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message } = req.body;
      const systemInstruction = `Você é Mariana, especialista em engenharia de aplicação e assistente virtual oficial da WOX FABER — Engineered Audio Solutions (woxfaber.com.br).
Sua missão é responder com cortesia, precisão técnica e sofisticação a dúvidas sobre os sistemas eletroacústicos da marca (como a caixa ativa KRS315A de 3000W, o subwoofer KRS212SB de 1000W, o distribuidor de RF SNC-400, processamento DSP 96kHz, garantia de troca modular e cálculos de SPL/Delay).
Sempre que o cliente perguntar sobre preços, cotações, testes in-loco ou projetos para igrejas, templos, teatros ou shows, indique de forma educada e prestativa que ele entre em contato diretamente pelo e-mail oficial: woxfaberbrasil@gmail.com.
Responda em português do Brasil de forma concisa, profissional e elegante.`;

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        const lower = (message || '').toLowerCase();
        let reply = 'Olá! Sou a Mariana, engenheira de aplicação da WOX FABER. Posso lhe auxiliar com informações sobre nossos sistemas eletroacústicos de alta pressão sonora (como a KRS315A de 3000W) e alinhamento acústico. Para cotações e propostas comerciais oficiais, por favor entre em contato diretamente pelo e-mail woxfaberbrasil@gmail.com.';
        if (lower.includes('krs315a') || lower.includes('caixa') || lower.includes('potencia')) {
          reply = 'A KRS315A é nossa caixa ativa de referência de 3000W de pico, com SPL máximo de 132 dB, DSP de 96kHz e transdutor de 15" com bobina de 75mm. Para solicitar cotação ou simulação para seu espaço, envie um e-mail para woxfaberbrasil@gmail.com.';
        } else if (lower.includes('sub') || lower.includes('krs212sb') || lower.includes('grave')) {
          reply = 'O Subwoofer KRS212SB entrega 1000W de potência contínua com resposta visceral em graves profundos. Para projetos de sonorização de igrejas e shows, fale diretamente com nossa engenharia pelo e-mail woxfaberbrasil@gmail.com.';
        } else if (lower.includes('modular') || lower.includes('troca') || lower.includes('garantia') || lower.includes('suporte')) {
          reply = 'Nosso suporte conta com troca modular em bloco (Plug-and-Play) em 5 minutos, sem necessidade de oficina ou soldas. Para acionar o suporte, escreva para woxfaberbrasil@gmail.com.';
        } else if (lower.includes('email') || lower.includes('contato') || lower.includes('comprar') || lower.includes('preco') || lower.includes('cotacao')) {
          reply = 'Nosso atendimento comercial e de engenharia é realizado exclusivamente pelo e-mail oficial: woxfaberbrasil@gmail.com. Envie sua mensagem com as dimensões do seu espaço para recebermos seu projeto!';
        }
        res.json({ reply });
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: message,
        config: {
          systemInstruction,
        },
      });

      res.json({ reply: response.text || 'Entre em contato conosco pelo e-mail woxfaberbrasil@gmail.com.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar';
      res.status(500).json({
        reply: 'Nossa engenharia atende diretamente pelo e-mail woxfaberbrasil@gmail.com. Envie sua dúvida!',
        error: msg,
      });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      vercelBlobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      firebaseConfigured: true,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use('/uploads', express.static(uploadsDir));
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WOX FABER Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
