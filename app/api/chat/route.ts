import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60; // Set max duration for Vercel

export async function POST(req: Request) {
  try {
    const { messages, userApiKey, selectedModel, claudeApiKey } = await req.json();

    if (selectedModel?.startsWith('claude')) {
      const apiKeyToUse = claudeApiKey || process.env.ANTHROPIC_API_KEY;
      
      if (!apiKeyToUse) {
        return new Response(JSON.stringify({ error: 'No Claude API key provided' }), { status: 401 });
      }

      const anthropic = new Anthropic({ apiKey: apiKeyToUse });

      const stream = await anthropic.messages.create({
        model: selectedModel,
        max_tokens: 1024,
        messages: messages.map((m: any) => ({
          role: m.role === 'model' ? 'assistant' : 'user',
          content: m.content
        })),
        system: "You are BotBuddy, a helpful, friendly, and intelligent AI assistant. Provide clear, concise, and accurate answers.",
        stream: true
      });

      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
                controller.enqueue(new TextEncoder().encode(chunk.delta.text));
              }
            }
            controller.close();
          } catch (err) {
            controller.error(err);
          }
        }
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Default to Gemini API
    const apiKeyToUse = userApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKeyToUse) {
      return new Response(JSON.stringify({ error: 'No API key provided' }), { status: 401 });
    }

    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });

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

  } catch (error: any) {
    console.error('Chat API Error:', error);
    const status = error.status || (error.message?.includes('401') ? 401 : 500);
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate response' }), { status });
  }
}
