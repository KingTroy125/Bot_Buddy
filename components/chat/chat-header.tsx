'use client';

import React from 'react';
import { PanelLeftOpen } from 'lucide-react';

interface ChatHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeChatTitle: string;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export function ChatHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  activeChatTitle,
  selectedModel,
  setSelectedModel,
}: ChatHeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 hover:bg-muted border border-transparent hover:border-border text-muted-foreground transition-colors"
            title="Open sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
        <h1 className="font-mono text-xs tracking-widest uppercase text-foreground truncate">
          {activeChatTitle}
        </h1>
      </div>

      <div className="relative w-40 sm:w-48">
        <select
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            localStorage.setItem('botbuddy-model', e.target.value);
          }}
          className="w-full bg-background border border-border p-1.5 text-[10px] sm:text-xs font-mono focus:outline-none focus:ring-1 focus:ring-foreground appearance-none cursor-pointer"
        >
          <option className="bg-background text-foreground" value="gemini-3-flash-preview">Gemini 3 Flash</option>
          <option className="bg-background text-foreground" value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
          <option className="bg-background text-foreground" value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash</option>
          <option className="bg-background text-foreground" value="claude-4-5-sonnet-beta">Claude Sonnet 4.5 Beta</option>
          <option className="bg-background text-foreground" value="toqan-agent">Toqan Agent</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
          <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </header>
  );
}
