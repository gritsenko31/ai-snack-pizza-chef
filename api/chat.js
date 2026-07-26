// api/chat.js

export default async function handler(req, res) {
  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Достаем API ключ из переменных окружения Vercel
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  try {
    const { messages, model } = req.body;

    // Делаем запрос к OpenRouter прямо с сервера Vercel
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        // Опциональные заголовки для OpenRouter:
        'HTTP-Referer': req.headers.origin || 'https://vercel.app',
        'X-Title': 'Chess Game Project'
      },
      body: JSON.stringify({
        model: model || 'openai/gpt-3.5-turbo', // Ваш дефолтный промпт/модель
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || 'OpenRouter API Error' });
    }

    // Возвращаем ответ обратно на фронтенд
    return res.status(200).json(data);

  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}