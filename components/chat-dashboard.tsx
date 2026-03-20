'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  Menu, 
  Plus, 
  MessageSquare, 
  Trash2, 
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig, type Transition } from 'motion/react';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const transition: Transition = { type: "spring", bounce: 0, duration: 0.4 };

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};

export default function ChatDashboard() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chats and settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }

    const savedChats = localStorage.getItem('botbuddy-chats');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        setChats(parsed);
        if (parsed.length > 0) {
          setActiveChatId(parsed[0].id);
        }
      } catch (e) {
        console.error('Failed to parse chats', e);
      }
    }
    
    const savedKey = localStorage.getItem('botbuddy-api-key');
    if (savedKey) setUserApiKey(savedKey);
    
    const savedClaudeKey = localStorage.getItem('botbuddy-claude-api-key');
    if (savedClaudeKey) setClaudeApiKey(savedClaudeKey);
    
    const savedUser = localStorage.getItem('botbuddy-user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUsername(savedUser);
    }
    
    const savedModel = localStorage.getItem('botbuddy-model');
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('botbuddy-chats', JSON.stringify(chats));
    } else {
      localStorage.removeItem('botbuddy-chats');
    }
  }, [chats]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const activeChat = chats.find(c => c.id === activeChatId);

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      if (activeChatId === id) {
        setActiveChatId(updated.length > 0 ? updated[0].id : null);
      }
      return updated;
    });
  };

  const generateTitle = async (firstMessage: string) => {
    try {
      const response = await fetch('/api/chat/title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstMessage,
          userApiKey,
        }),
      });
      
      if (!response.ok) return 'New Chat';
      const data = await response.json();
      return data.title || 'New Chat';
    } catch (e) {
      console.error('Failed to generate title', e);
      return 'New Chat';
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessageContent = input.trim();
    setInput('');
    setIsLoading(true);

    let currentChatId = activeChatId;
    let isNewChat = false;

    // If no active chat, create one
    if (!currentChatId || !activeChat) {
      currentChatId = crypto.randomUUID();
      isNewChat = true;
      const newChat: Chat = {
        id: currentChatId,
        title: 'New Chat',
        messages: [],
        updatedAt: Date.now(),
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(currentChatId);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userMessageContent,
      timestamp: Date.now(),
    };

    // Add user message to UI immediately
    setChats(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          messages: [...chat.messages, userMessage],
          updatedAt: Date.now(),
        };
      }
      return chat;
    }));

    try {
      // Get chat history for context
      const currentChat = chats.find(c => c.id === currentChatId);
      const history = currentChat?.messages.map(m => ({
        role: m.role,
        content: m.content
      })) || [];
      
      const messages = [...history, { role: 'user', content: userMessageContent }];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          userApiKey,
          selectedModel,
          claudeApiKey,
        }),
      });

      if (!response.ok) {
        let apiError = 'Failed to fetch response';
        try {
          const errData = await response.json();
          apiError = errData.error || apiError;
        } catch (e) {}

        if (response.status === 401) {
          if (apiError.toLowerCase().includes('invalid') || apiError.includes('401')) {
            throw new Error('invalid_api_key');
          }
          throw new Error('missing_api_key');
        }
        throw new Error(apiError);
      }

      const modelMessageId = crypto.randomUUID();
      
      // Add empty model message
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, {
              id: modelMessageId,
              role: 'model',
              content: '',
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }));

      // Handle stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const text = decoder.decode(value, { stream: true });
          fullResponse += text;
          
          setChats(prev => prev.map(chat => {
            if (chat.id === currentChatId) {
              const updatedMessages = [...chat.messages];
              const lastMsgIndex = updatedMessages.findIndex(m => m.id === modelMessageId);
              if (lastMsgIndex >= 0) {
                updatedMessages[lastMsgIndex] = {
                  ...updatedMessages[lastMsgIndex],
                  content: fullResponse,
                };
              }
              return { ...chat, messages: updatedMessages, updatedAt: Date.now() };
            }
            return chat;
          }));
        }
      }

      // Generate title for new chat
      if (isNewChat || (currentChat?.messages.length === 0)) {
        const title = await generateTitle(userMessageContent);
        setChats(prev => prev.map(chat => {
          if (chat.id === currentChatId) {
            return { ...chat, title };
          }
          return chat;
        }));
      }

    } catch (error: any) {
      console.error('Error generating response:', error);
      
      const errorMessage = error.message === 'missing_api_key'
        ? '⚠️ **API Key Required**\n\nIt looks like you haven\'t added an API key yet.\n\nPlease click on **Settings** in the sidebar to add your API key so we can chat!'
        : error.message === 'invalid_api_key'
        ? '⚠️ **Invalid API Key**\n\nThe API key you provided is invalid or unauthorized. Please check your Settings and ensure you have correct access.'
        : `Sorry, I encountered an error: ${error.message}`;

      // Add error message
      setChats(prev => prev.map(chat => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, {
              id: crypto.randomUUID(),
              role: 'model',
              content: errorMessage,
              timestamp: Date.now(),
            }],
            updatedAt: Date.now(),
          };
        }
        return chat;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <MotionConfig transition={transition}>
      <div className={cn(
        "relative w-full h-screen bg-background text-foreground overflow-hidden",
        "grid grid-cols-[1fr_0.5rem_minmax(0,64rem)_0.5rem_1fr]",
        "sm:grid-cols-[1fr_1rem_minmax(0,80rem)_1rem_1fr]",
        "[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]",
        "dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]"
      )}>
        {/* ── Left patterned strip ── */}
        <div
          aria-hidden
          className={cn(
            "col-start-2 row-span-full border-x border-border",
            "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
            "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
            "bg-[size:10px_10px] bg-fixed",
          )}
        />

        {/* ── Right patterned strip ── */}
        <div
          aria-hidden
          className={cn(
            "col-start-4 row-span-full border-x border-border",
            "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
            "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
            "bg-[size:10px_10px] bg-fixed",
          )}
        />

        {/* ── Content column ── */}
        <div className="col-start-3 flex flex-col h-full overflow-hidden relative">
          {/* Top dashed divider */}
          <div
            aria-hidden
            className={cn(
              "w-full border-t border-dashed border-border shrink-0",
              "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
            )}
          />

          <div className="flex-1 flex overflow-hidden relative">
            {/* Sidebar */}
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

                  <div className="p-4 border-b border-border">
                    <button
                      onClick={createNewChat}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-foreground hover:bg-foreground/90 text-background transition-colors text-xs font-mono tracking-widest uppercase"
                    >
                      <Plus size={14} />
                      New Chat
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {chats.length === 0 ? (
                      <div className="text-center text-muted-foreground font-mono text-[10px] tracking-widest uppercase mt-10 px-4">
                        No chats yet.
                      </div>
                    ) : (
                      chats.sort((a, b) => b.updatedAt - a.updatedAt).map(chat => (
                        <div
                          key={chat.id}
                          onClick={() => {
                            setActiveChatId(chat.id);
                            if (window.innerWidth < 768) setIsSidebarOpen(false);
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

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-background">
              {/* Header */}
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
                    {activeChat?.title || 'New Chat'}
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
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="max-w-3xl mx-auto w-full space-y-8 pb-20">
                  {!activeChat || activeChat.messages.length === 0 ? (
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
                    activeChat.messages.map((message) => (
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
                            <div className="whitespace-pre-wrap break-words text-[14px] md:text-[15px] leading-relaxed">{message.content}</div>
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

              {/* Input Area */}
              <div className="p-2 sm:p-4 bg-background border-t border-border">
                <div className="max-w-3xl mx-auto w-full relative">
                  <form
                    onSubmit={handleSubmit}
                    className="relative flex items-end gap-2 bg-background border border-border p-2 focus-within:ring-1 focus-within:ring-foreground transition-all"
                  >
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="w-full max-h-[200px] min-h-[44px] bg-transparent border-0 focus:ring-0 resize-none py-3 px-3 text-[15px] text-foreground placeholder:text-muted-foreground custom-scrollbar"
                      rows={1}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="size-10 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-colors shrink-0 mb-0.5 mr-0.5 flex items-center justify-center"
                    >
                      <Send size={16} className={input.trim() && !isLoading ? 'translate-x-[1px] -translate-y-[1px] transition-transform' : ''} />
                    </button>
                  </form>
                  <div className="text-center mt-3 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    BotBuddy can make mistakes. Consider verifying important information.
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-background/80 z-10 md:hidden backdrop-blur-sm"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Bottom dashed divider */}
          <div
            aria-hidden
            className={cn(
              "w-full border-b border-dashed border-border shrink-0",
              "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
            )}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-sm font-medium tracking-widest uppercase text-foreground">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Account</label>
                  {isLoggedIn ? (
                    <div className="flex items-center justify-between p-3 border border-border bg-muted/30">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-foreground" />
                        <span className="font-mono text-xs text-foreground">{username}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setIsLoggedIn(false);
                          setUsername('');
                          localStorage.removeItem('botbuddy-user');
                        }} 
                        className="text-[10px] font-mono text-red-500 hover:text-red-600 uppercase tracking-widest"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        className="flex-1 bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                      <button
                        onClick={() => {
                          if (username.trim()) {
                            setIsLoggedIn(true);
                            localStorage.setItem('botbuddy-user', username.trim());
                          }
                        }}
                        disabled={!username.trim()}
                        className="px-4 bg-foreground text-background text-xs font-mono uppercase tracking-widest disabled:opacity-50"
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>



                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Select Active Model</label>
                    <div className="relative">
                      <select
                        value={selectedModel}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                          localStorage.setItem('botbuddy-model', e.target.value);
                        }}
                        className="w-full bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground appearance-none cursor-pointer"
                      >
                        <option className="bg-background text-foreground" value="gemini-3-flash-preview">Gemini 3 Flash</option>
                        <option className="bg-background text-foreground" value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                        <option className="bg-background text-foreground" value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash</option>
                        <option className="bg-background text-foreground" value="claude-4-5-sonnet-beta">Claude Sonnet 4.5 Beta</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-border">
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                      {selectedModel.startsWith('claude') ? 'Claude API Key' : 'Gemini API Key'}
                    </label>
                    {selectedModel.startsWith('claude') ? (
                      <input
                        type="password"
                        value={claudeApiKey}
                        onChange={(e) => {
                          setClaudeApiKey(e.target.value);
                          if (e.target.value) localStorage.setItem('botbuddy-claude-api-key', e.target.value);
                          else localStorage.removeItem('botbuddy-claude-api-key');
                        }}
                        placeholder="Enter your Claude API key"
                        className="w-full bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    ) : (
                      <input
                        type="password"
                        value={userApiKey}
                        onChange={(e) => {
                          setUserApiKey(e.target.value);
                          if (e.target.value) localStorage.setItem('botbuddy-api-key', e.target.value);
                          else localStorage.removeItem('botbuddy-api-key');
                        }}
                        placeholder="Enter your Gemini API key"
                        className="w-full bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    )}
                    <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                      Leave empty to use the default system key. Your key is stored locally in your browser and never sent to our servers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-3 text-xs font-mono tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
