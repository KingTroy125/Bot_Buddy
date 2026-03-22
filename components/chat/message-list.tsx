'use client';

import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  setInput: (input: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  messagesEndRef,
  setInput,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
      <div className="max-w-3xl mx-auto w-full space-y-8 pb-20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center mt-20">
            <div className="w-16 h-16 bg-muted border border-border text-foreground flex items-center justify-center mb-8 pr-1">
              <Bot size={32} />
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-4 tracking-tight">How can I help you today?</h2>
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase max-w-md mb-12">
              I&apos;m BotBuddy, your intelligent AI assistant.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {[
                "Explain quantum computing in simple terms",
                "Write a python script to scrape a website",
                "Give me ideas for a weekend getaway",
                "Help me write a professional email"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="p-4 bg-background border border-border text-left hover:bg-muted transition-all text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={message.id}
              className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted-foreground px-1">
                {message.role === 'model' ? (
                  <>
                    <Bot size={12} />
                    <span>BotBuddy</span>
                  </>
                ) : (
                  <>
                    <span>You</span>
                    <User size={12} />
                  </>
                )}
              </div>
              <div
                className={`max-w-[90%] md:max-w-[85%] px-4 py-3 md:px-5 md:py-4 border ${
                  message.role === 'user'
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border'
                }`}
              >
                {message.role === 'user' ? (
                  <div className="flex flex-col gap-3">
                    {message.images && message.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.images.map((img, i) => (
                          <img key={i} src={`data:${img.mimeType};base64,${img.data}`} alt={img.name} className="w-48 h-auto object-contain rounded-sm border border-border/50" />
                        ))}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words text-[14px] md:text-[15px] leading-relaxed">{message.content}</div>
                  </div>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 items-start"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted-foreground px-1">
              <Bot size={12} />
              <span>BotBuddy</span>
            </div>
            <div className="bg-background border border-border px-5 py-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
