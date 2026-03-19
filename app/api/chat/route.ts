import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Set max duration for Vercel

export async function POST(req: Request) {
  try {
    const { messages, userApiKey, selectedModel } = await req.json();

    const apiKeyToUse = userApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKeyToUse) {
      return new Response(JSON.stringify({ error: 'No API key provided' }), { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

    // Assuming messages is strictly {role, content}
    const contents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContentStream({
      model: selectedModel || 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "You are BotBuddy, a helpful, friendly, and intelligent AI assistant. Provide clear, concise, and accurate answers.",
      }
    });

    // Create a new ReadableStream from the async iterable
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text || '';
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
}
