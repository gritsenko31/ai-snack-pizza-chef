// api/chat.js
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages, model, apiKey: customApiKey } = req.body;

    // Используем ключ из запроса (если ввели в настройках) или из Vercel Environment Variables
    const rawKey = customApiKey || process.env.OPENROUTER_API_KEY;

    if (!rawKey) {
      return res.status(500).json({ error: 'API key is missing. Please set it in Vercel or Settings.' });
    }

    const apiKey = rawKey.trim();

    // Делаем запрос к OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ai-snack-pizza-chef.vercel.app',
        'X-Title': 'AI Snack Pizza Chef'
      },
      body: JSON.stringify({
        // Берем модель из запроса или надежный бесплатный/дешевый дефолт
        model: model || 'meta-llama/llama-3-8b-instruct:free', 
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter Error Response:', JSON.stringify(data));
      const errorMsg = data?.error?.message || data?.error || `OpenRouter Error Status ${response.status}`;
      return res.status(response.status).json({ error: errorMsg });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
