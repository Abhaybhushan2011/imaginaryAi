export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: API Key missing.',
    });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Valid prompt context required.' });
  }

  const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

  try {
    const hfResponse = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt.trim() }),
    });

    if (!hfResponse.ok) {
      if (hfResponse.status === 503) {
        return res.status(503).json({ error: 'AI Clusters loading data layers. Re-try in 5 seconds!' });
      }
      return res.status(hfResponse.status).json({ error: `Engine busy (${hfResponse.status})` });
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    
    // Safety size evaluation to catch empty responses
    if (arrayBuffer.byteLength === 0) {
      return res.status(500).json({ error: 'Empty buffer stream returned from AI cluster.' });
    }
    
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/png;base64,${base64}`;

    return res.status(200).json({ image: dataUri });
  } catch (err) {
    console.error('System generation runtime failure:', err);
    return res.status(500).json({
      error: `Network operational crash: ${err.message || 'Unknown matrix error'}`,
    });
  }
}
