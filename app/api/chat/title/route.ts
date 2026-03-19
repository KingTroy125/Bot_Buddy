import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { firstMessage, userApiKey } = await req.json();

    const apiKeyToUse = userApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKeyToUse) {
      return new Response(JSON.stringify({ title: 'New Chat' }), { status: 200 });
    }

    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a very short, concise title (max 4 words) for a chat that starts with this message: "${firstMessage}". Do not use quotes around the title.`,
    });

    return new Response(JSON.stringify({ 
      title: response.text?.trim() || 'New Chat' 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Title Generation Error:', error);
    return new Response(JSON.stringify({ title: 'New Chat' }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
