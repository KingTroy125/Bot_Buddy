'use client';

import React from 'react';
import { Send, Paperclip, ImageIcon, X } from 'lucide-react';
import { Attachment } from './types';

interface MessageInputProps {
  input: string;
  setInput: (input: string) => void;
  attachments: Attachment[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAttachment: (index: number) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function MessageInput({
  input,
  setInput,
  attachments,
  handleFileChange,
  handleRemoveAttachment,
  handleSubmit,
  isLoading,
  textareaRef,
  fileInputRef,
  handleKeyDown,
}: MessageInputProps) {
  return (
    <div className="p-2 sm:p-4 bg-background">
      <div className="max-w-3xl mx-auto w-full relative flex flex-col gap-2">
        {/* Staged Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1">
            {attachments.map((att, i) => (
              <div key={i} className="relative group bg-muted border border-border px-3 py-1.5 flex items-center gap-2 text-xs font-mono truncate max-w-[200px]">
                {att.type === 'image' ? <ImageIcon size={12} className="shrink-0" /> : <Paperclip size={12} className="shrink-0" />}
                <span className="truncate">{att.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(i)}
                  className="absolute -top-1.5 -right-1.5 bg-foreground text-background rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-background border border-border p-2 focus-within:ring-1 focus-within:ring-foreground transition-all"
        >
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,.txt,.md,.csv,.json"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="size-10 text-muted-foreground hover:text-foreground transition-colors shrink-0 mb-0.5 ml-0.5 flex items-center justify-center"
            title="Attach Image or File"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full max-h-[200px] min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-1 text-[15px] text-foreground placeholder:text-muted-foreground custom-scrollbar"
            rows={1}
          />
          <button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className="size-10 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors shrink-0 mb-0.5 mr-0.5 flex items-center justify-center"
          >
            <Send size={16} className={(input.trim() || attachments.length > 0) && !isLoading ? 'translate-x-[1px] -translate-y-[1px] transition-transform' : ''} />
          </button>
        </form>
        <div className="text-center mt-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          BotBuddy can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
}
