import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60; // Set max duration for Vercel

const SYSTEM_INSTRUCTION = "You are BotBuddy, a helpful, friendly, and intelligent AI assistant. If the user asks for a picture, photo, logo, or image to be drawn/generated of anything, ALWAYS respond with the following exact markdown format: ![Description](https://image.pollinations.ai/prompt/<encoded_description>?width=800&height=800&nologo=true) Replace <encoded_description> with the detailed visual prompt of what they requested securely URL-encoded. You must not use code blocks for the image, just output the raw markdown tag.";

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
        messages: messages.map((m: any) => {
          if (m.role === 'model') return { role: 'assistant', content: m.content };
          if (m.images && m.images.length > 0) {
            return {
              role: 'user',
              content: [
                ...m.images.map((img: any) => ({
                  type: 'image',
                  source: { type: 'base64', media_type: img.mimeType, data: img.data }
                })),
                { type: 'text', text: m.content }
              ]
            };
          }
          return { role: 'user', content: m.content };
        }),
        system: SYSTEM_INSTRUCTION,
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

    const contents = messages.map((m: any) => {
      if (m.images && m.images.length > 0) {
        return {
          role: m.role,
          parts: [
            ...m.images.map((img: any) => ({
              inlineData: { data: img.data, mimeType: img.mimeType }
            })),
            { text: m.content }
          ]
        };
      }
      return {
        role: m.role,
        parts: [{ text: m.content }]
      };
    });

    const response = await ai.models.generateContentStream({
      model: selectedModel || 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
