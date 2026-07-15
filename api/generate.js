// Vercel Serverless Function — Secure Hugging Face Proxy
// Endpoint: POST /api/generate
// Converts Hugging Face binary image response to Base64 Data URI

export default async function handler(req, res) {
  // CORS headers for Vercel deployment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Server configuration error: HUGGINGFACE_API_KEY is not set.',
    });
  }

  const { prompt, aspectRatio } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'A valid prompt string is required.' });
  }

  // Map aspect ratios to pixel dimensions for SDXL
  const dimensionMap = {
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '9:16': { width: 768, height: 1344 },
  };

  const dimensions = dimensionMap[aspectRatio] || dimensionMap['1:1'];

  const MODEL_URL =
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';

  try {
    const hfResponse = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt.trim(),
        parameters: {
          width: dimensions.width,
          height: dimensions.height,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      let errorMessage = `Hugging Face API error (${hfResponse.status})`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        // Use the default error message
      }
      return res.status(hfResponse.status).json({ error: errorMessage });
    }

    // Read the binary image response as a buffer
    const arrayBuffer = await hfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine content type (HF typically returns image/jpeg or image/png)
    const contentType = hfResponse.headers.get('content-type') || 'image/png';

    // Compile to Base64 Data URI
    const base64 = buffer.toString('base64');
    const dataUri = `data:${contentType};base64,${base64}`;

    return res.status(200).json({ image: dataUri });
  } catch (err) {
    console.error('Generation error:', err);
    return res.status(500).json({
      error: 'Failed to generate image. Please try again.',
    });
  }
}
