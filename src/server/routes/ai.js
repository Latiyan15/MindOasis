const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

// Bypass SSL certificate errors caused by enterprise firewalls (like FortiGuard) intercepting traffic
const httpsAgent = new https.Agent({  
  rejectUnauthorized: false
});

/**
 * AI Image Proxy
 * This endpoint fetches images from external AI providers (like Pollinations),
 * bypassing browser CORS restrictions and ORB blocks completely.
 */
router.get('/image', async (req, res) => {
  try {
    const { prompt, model = 'flux', width = 1024, height = 1024, seed } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const safePrompt = encodeURIComponent(prompt);
    const targetUrl = `https://image.pollinations.ai/prompt/${safePrompt}?seed=${seed || Math.floor(Math.random() * 1000000)}&width=${width}&height=${height}&model=${model}&nologo=true`;

    console.log(`[AI Proxy] Fetching from: ${targetUrl}`);

    // Fetch the image as a buffer stream
    const response = await axios({
      method: 'GET',
      url: targetUrl,
      responseType: 'stream',
      httpsAgent: httpsAgent,
      timeout: 30000 // 30 second timeout for image generation
    });

    // Check if FortiGuard or another filter returned an HTML block page with a 200 OK
    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('image')) {
      throw new Error(`Upstream returned non-image content type: ${contentType}. Likely blocked by network filter.`);
    }

    // Forward the content type
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=31536000'); 

    // Pipe the image stream directly to the client
    return response.data.pipe(res);

  } catch (error) {
    console.error('[AI Proxy] Primary generation failed:', error.message);
    
    // Deep Fallback: Return a beautiful, abstract generative SVG using Dicebear 
    // This acts as a highly reliable visual placeholder that fits the application's aesthetic
    // and bypassing AI generator blocks entirely.
    try {
      const fallbackSeed = req.query.seed || encodeURIComponent(req.query.prompt);
      const fallbackUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${fallbackSeed}&backgroundColor=f8fafc`;
      console.log(`[AI Proxy] Using abstract art fallback: ${fallbackUrl}`);
      
      const fallbackResponse = await axios({
        method: 'GET',
        url: fallbackUrl,
        responseType: 'stream',
        httpsAgent: httpsAgent,
        timeout: 10000
      });
      
      res.set('Content-Type', 'image/svg+xml');
      return fallbackResponse.data.pipe(res);
    } catch (fallbackError) {
      console.error('[AI Proxy] Total failure:', fallbackError.message);
      return res.status(500).json({ error: 'All image generation methods failed.' });
    }
  }
});

module.exports = router;
