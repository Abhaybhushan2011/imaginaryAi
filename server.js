import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── POST /api/generate ─────────────────────────────────────────────
// Mirrors the Vercel serverless function in api/generate.js
// so everything works identically in local development.
// ─────────────────────────────────────────────────────────────────────
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey || apiKey === 'your_huggingface_api_key_here') {
    return res.status(500).json({
      error:
        'API key not configured. Open the .env file and paste your HuggingFace API key.',
    });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a valid prompt.' });
  }

  const MODEL_URL =
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

  try {
    console.log(`⏳ Generating image for: "${prompt.trim().slice(0, 80)}…"`);

    const hfResponse = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt.trim() }),
    });

    if (!hfResponse.ok) {
      const errorBody = await hfResponse.text().catch(() => '');
      console.error(`HuggingFace API error ${hfResponse.status}:`, errorBody);

      if (hfResponse.status === 503) {
        return res.status(503).json({
          error:
            'The AI model is loading (cold start). Please wait ~20 seconds and try again.',
        });
      }
      if (hfResponse.status === 401) {
        return res.status(401).json({
          error:
            'Invalid API key. Check your .env file and make sure your HuggingFace token is correct.',
        });
      }
      return res
        .status(hfResponse.status)
        .json({ error: `HuggingFace API error (${hfResponse.status}). Try again later.` });
    }

    const arrayBuffer = await hfResponse.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      return res.status(500).json({ error: 'Received empty response from the AI model.' });
    }

    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    console.log(`✅ Image generated (${(buffer.length / 1024).toFixed(0)} KB)`);

    return res.status(200).json({ image: dataUri });
  } catch (err) {
    console.error('Generation failed:', err);
    return res.status(500).json({
      error: `Failed to generate image: ${err.message || 'Unknown error'}`,
    });
  }
});

// ─── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('┌──────────────────────────────────────────────┐');
  console.log('│   🎨 Imaginary AI — API Server               │');
  console.log(`│   Running on http://localhost:${PORT}            │`);
  console.log('│                                              │');
  if (!process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_KEY === 'your_huggingface_api_key_here') {
    console.log('│   ⚠️  API key NOT set! Edit .env file        │');
  } else {
    console.log('│   ✅ API key loaded                          │');
  }
  console.log('└──────────────────────────────────────────────┘');
  console.log('');
});
