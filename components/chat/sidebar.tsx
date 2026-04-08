'use client';

import React from 'react';
import { 
  Bot, 
  User, 
  Plus, 
  MessageSquare, 
  Trash2, 
  PanelLeftClose,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chat } from './types';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  createNewChat: () => void;
  deleteChat: (e: React.MouseEvent, id: string) => void;
  isLoggedIn: boolean;
  username: string;
  setIsSettingsOpen: (open: boolean) => void;
  activeView: 'chat' | 'agents';
  setActiveView: (view: 'chat' | 'agents') => void;
}

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  chats,
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
  isLoggedIn,
  username,
  setIsSettingsOpen,
  activeView,
  setActiveView,
}: SidebarProps) {
  return (
    <AnimatePresence mode="wait">
      {isSidebarOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="h-full bg-background flex flex-col border-r border-border shrink-0 z-20 absolute md:relative"
        >
          <div className="p-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase text-foreground">
              <div className="w-6 h-6 bg-foreground flex items-center justify-center">
                <Bot size={14} className="text-background" />
              </div>
              BotBuddy
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-muted text-muted-foreground md:hidden border border-transparent hover:border-border transition-colors"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          <div className="p-4 border-b border-border flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveView('chat');
                createNewChat();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground hover:bg-foreground/90 text-background transition-colors text-xs font-mono tracking-widest uppercase"
            >
              <Plus size={14} />
              New Chat
            </button>
            <button
              onClick={() => setActiveView('agents')}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 transition-colors text-xs font-mono tracking-widest uppercase border ${
                activeView === 'agents' 
                  ? 'bg-muted border-border text-foreground' 
                  : 'bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot size={14} />
              Explore Agents
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {chats.length === 0 ? (
              <div className="text-center text-muted-foreground font-mono text-[10px] tracking-widest uppercase mt-10 px-4">
                No chats yet.
              </div>
            ) : (
              [...chats].sort((a, b) => b.updatedAt - a.updatedAt).map(chat => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setActiveView('chat');
                    setActiveChatId(chat.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-colors text-sm border ${
                    activeChatId === chat.id 
                      ? 'bg-muted border-border text-foreground' 
                      : 'bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <MessageSquare size={14} className="shrink-0 opacity-70" />
                    <span className="truncate font-medium">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => deleteChat(e, chat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all shrink-0"
                    title="Delete chat"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-border flex flex-col gap-2">
            {isLoggedIn ? (
              <div className="flex items-center justify-between px-3 py-2 text-xs font-mono tracking-widest uppercase text-foreground border border-border bg-muted/30">
                <div className="flex items-center gap-2 truncate">
                  <User size={14} className="opacity-70 shrink-0" />
                  <span className="truncate">{username}</span>
                </div>
              </div>
            ) : null}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground cursor-pointer border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
            >
              <Settings size={14} className="opacity-70" />
              Settings
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
