export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST execution layer.' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server error: HUGGINGFACE_API_KEY environment variable is undefined on Vercel.',
    });
  }

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Prompt synchronization requires valid context input.' });
  }

  const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

  try {
    const hfResponse = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt.trim(),
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      let errorMessage = `Neural Cluster error (${hfResponse.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch (e) {}
      
      if (hfResponse.status === 503) {
        return res.status(503).json({ error: 'AI Tensor cores are booting up. Re-run prompt in 10 seconds!' });
      }
      return res.status(hfResponse.status).json({ error: errorMessage });
    }

    const arrayBuffer = await hfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = hfResponse.headers.get('content-type') || 'image/png';

    const base64 = buffer.toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    return res.status(200).json({ image: dataUri });
  } catch (err) {
    console.error('Runtime system crash:', err);
    return res.status(500).json({
      error: 'Failed to process matrix buffer parameters on secure runtime compiler.',
    });
  }
}
