'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig, type Transition } from 'motion/react';
import { cn } from '@/lib/utils';

const transition: Transition = { type: "spring", bounce: 0, duration: 0.4 };

import { Sidebar } from './chat/sidebar';
import { ChatHeader } from './chat/chat-header';
import { MessageList } from './chat/message-list';
import { MessageInput } from './chat/message-input';
import { SettingsModal } from './chat/settings-modal';
import { Attachment, Message, Chat } from './chat/types';

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
  const [toqanApiKey, setToqanApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

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
    
    const savedToqanKey = localStorage.getItem('botbuddy-toqan-api-key');
    if (savedToqanKey) setToqanApiKey(savedToqanKey);
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      if (file.type.startsWith('image/')) {
        reader.onload = (event) => {
          const base64String = (event.target?.result as string).split(',')[1];
          setAttachments(prev => [...prev, { name: file.name, data: base64String, type: 'image', mimeType: file.type }]);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (event) => {
          setAttachments(prev => [...prev, { name: file.name, data: event.target?.result as string, type: 'text', mimeType: file.type }]);
        };
        reader.readAsText(file);
      }
    }
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessageContent = input.trim();
    
    const imageAttachments = attachments.filter(a => a.type === 'image');
    const textAttachmentsContent = attachments
      .filter(a => a.type === 'text')
      .map(a => `\n\n--- File: ${a.name} ---\n${a.data}\n--- End File ---`)
      .join('');
      
    const finalUserContent = userMessageContent + textAttachmentsContent;

    setInput('');
    setAttachments([]);
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
      content: finalUserContent,
      timestamp: Date.now(),
      images: imageAttachments.length > 0 ? imageAttachments.map(img => ({ name: img.name, data: img.data, mimeType: img.mimeType })) : undefined
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
        content: m.content,
        images: m.images
      })) || [];
      
      const messages = [...history, { role: 'user', content: finalUserContent, images: userMessage.images }];

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
          toqanApiKey,
          toqanConversationId: activeChat?.toqanConversationId,
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

      // Check for Toqan Conversation ID in headers
      const receivedToqanId = response.headers.get('X-Toqan-Conversation-Id');
      if (receivedToqanId) {
        setChats(prev => prev.map(chat => {
          if (chat.id === currentChatId) {
            return { ...chat, toqanConversationId: receivedToqanId };
          }
          return chat;
        }));
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
            <Sidebar 
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
              chats={chats}
              activeChatId={activeChatId}
              setActiveChatId={setActiveChatId}
              createNewChat={createNewChat}
              deleteChat={deleteChat}
              isLoggedIn={isLoggedIn}
              username={username}
              setIsSettingsOpen={setIsSettingsOpen}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 relative bg-background">
              <ChatHeader 
                activeChatTitle={activeChat?.title || 'New Chat'}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />

              <MessageList 
                messages={activeChat?.messages || []}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                setInput={setInput}
              />

              <MessageInput 
                input={input}
                setInput={setInput}
                attachments={attachments}
                handleFileChange={handleFileChange}
                handleRemoveAttachment={handleRemoveAttachment}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                textareaRef={textareaRef}
                fileInputRef={fileInputRef}
                handleKeyDown={handleKeyDown}
              />
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

      <SettingsModal 
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        userApiKey={userApiKey}
        setUserApiKey={setUserApiKey}
        claudeApiKey={claudeApiKey}
        setClaudeApiKey={setClaudeApiKey}
        toqanApiKey={toqanApiKey}
        setToqanApiKey={setToqanApiKey}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        username={username}
        setUsername={setUsername}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </MotionConfig>
  );
}
