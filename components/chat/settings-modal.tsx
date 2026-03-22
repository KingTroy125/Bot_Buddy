'use client';

import React from 'react';
import { X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  claudeApiKey: string;
  setClaudeApiKey: (key: string) => void;
  toqanApiKey: string;
  setToqanApiKey: (key: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  username: string;
  setUsername: (name: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export function SettingsModal({
  isOpen,
  setIsOpen,
  userApiKey,
  setUserApiKey,
  claudeApiKey,
  setClaudeApiKey,
  toqanApiKey,
  setToqanApiKey,
  isLoggedIn,
  setIsLoggedIn,
  username,
  setUsername,
  selectedModel,
  setSelectedModel,
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-border w-full max-w-md p-6 flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-sm font-medium tracking-widest uppercase text-foreground">Settings</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
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
                      <option className="bg-background text-foreground" value="toqan-agent">Toqan Agent</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-border">
                  <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                    {selectedModel.startsWith('claude') ? 'Claude API Key' : selectedModel === 'toqan-agent' ? 'Toqan API Key' : 'Gemini API Key'}
                  </label>
                  {selectedModel.startsWith('claude') ? (
                    <input
                      type="password"
                      value={claudeApiKey}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setClaudeApiKey(e.target.value);
                        if (val) localStorage.setItem('botbuddy-claude-api-key', val);
                        else localStorage.removeItem('botbuddy-claude-api-key');
                      }}
                      placeholder="Enter your Claude API key"
                      className="w-full bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  ) : selectedModel === 'toqan-agent' ? (
                    <input
                      type="password"
                      value={toqanApiKey}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setToqanApiKey(e.target.value);
                        if (val) localStorage.setItem('botbuddy-toqan-api-key', val);
                        else localStorage.removeItem('botbuddy-toqan-api-key');
                      }}
                      placeholder="Enter your Toqan API key"
                      className="w-full bg-transparent border border-border p-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  ) : (
                    <input
                      type="password"
                      value={userApiKey}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        setUserApiKey(e.target.value);
                        if (val) localStorage.setItem('botbuddy-api-key', val);
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
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 text-xs font-mono tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
