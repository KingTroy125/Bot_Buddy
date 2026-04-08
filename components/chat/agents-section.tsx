'use client';

import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Search, 
  Plus, 
  ChevronRight, 
  X, 
  Save, 
  FileUp, 
  Settings2, 
  Zap, 
  BarChart3, 
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { Agent } from './types';
import { AgentCard } from './agent-card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AgentsSectionProps {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  onStartChat: (agent: Agent) => void;
}

export function AgentsSection({ agents, setAgents, onStartChat }: AgentsSectionProps) {
  const [currentMode, setCurrentMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'shared'>('all');

  // Form State
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    description: '',
    instructions: '',
    model: 'gemini-3-flash-preview',
  });

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'mine' && !agent.isExample);
      return matchesSearch && matchesFilter;
    });
  }, [agents, searchQuery, filter]);

  const handleCreate = () => {
    setFormData({
      name: '',
      description: '',
      instructions: '',
      model: 'gemini-3-flash-preview',
    });
    setCurrentMode('create');
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData(agent);
    setCurrentMode('edit');
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (currentMode === 'create') {
      const newAgent: Agent = {
        id: crypto.randomUUID(),
        name: formData.name!,
        description: formData.description || '',
        instructions: formData.instructions || '',
        model: formData.model || 'gemini-3-flash-preview',
        updatedAt: Date.now(),
        owner: 'User',
      };
      setAgents(prev => [newAgent, ...prev]);
    } else if (currentMode === 'edit' && editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...a, ...formData, updatedAt: Date.now() } as Agent : a));
    }
    setCurrentMode('list');
  };

  if (currentMode !== 'list') {
    return (
      <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentMode('list')}
              className="p-2 hover:bg-muted border border-border transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground pb-1">
                <span>Agents</span>
                <ChevronRight size={10} />
                <span className="text-foreground">{currentMode === 'create' ? 'New Agent' : editingAgent?.name}</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {currentMode === 'create' ? 'Create a new Agent' : 'Agent Details'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={() => setCurrentMode('list')}
              className="px-4 py-2 text-xs font-mono uppercase tracking-widest border border-border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              <Save size={14} />
              Save Agent
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto p-10 pb-32">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="details" className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none">
                  Details
                </TabsTrigger>
                <TabsTrigger value="tools" className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none">
                  Tools
                </TabsTrigger>
                <TabsTrigger value="advanced" className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none">
                  Advanced
                </TabsTrigger>
                <TabsTrigger value="stats" className="relative h-12 rounded-none border-b-2 border-transparent px-6 font-mono text-xs uppercase tracking-widest data-[state=active]:bg-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none">
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-8 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      Agent Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Code Reviewer"
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      Model <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors appearance-none"
                    >
                      <optgroup label="Gemini">
                        <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                        <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                        <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash Lite</option>
                        <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
                      </optgroup>
                      <optgroup label="Claude">
                        <option value="claude-4-5-sonnet-beta">Claude Sonnet 4.5</option>
                        <option value="claude-3-5-sonnet-20241022">Claude Sonnet 3.5</option>
                        <option value="claude-3-opus-20240229">Claude Opus 3</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="toqan-agent">Toqan Agent</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Describe this Agent to your users
                  </label>
                  <p className="text-[11px] text-muted-foreground -mt-1">We'll use this to create a system prompt for the Agent</p>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="An expert assistant that can help with..."
                    rows={2}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    Instructions <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground -mt-1">Define how the agent should behave and what knowledge it should have.</p>
                  <textarea 
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="You are a specialized assistant whose purpose is to..."
                    rows={10}
                    className="w-full bg-background border border-border px-4 py-3 focus:outline-none focus:border-foreground/30 transition-colors font-mono text-sm"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">Add files to the Agent</h4>
                  <div className="border-2 border-dashed border-border p-12 flex flex-col items-center justify-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-sm transition-transform group-hover:scale-110">
                      <FileUp size={20} className="text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1 uppercase tracking-tighter">PDF, TXT, DOCX, CSV and Images only, maximum 25 files</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="py-10 text-center animate-in fade-in-50 duration-300">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-sm mx-auto">
                    <Zap size={20} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold uppercase tracking-tight font-mono">Custom Tools</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Extend agent capabilities by adding API connections, web search, or custom code execution. (Coming Soon)
                  </p>
                  <button className="px-6 py-2 border border-border text-[10px] font-mono uppercase tracking-widest hover:bg-muted mt-4">Add Tool</button>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="py-10 space-y-12 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-between p-6 border border-border hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-500/10 text-orange-500">
                      <ShieldAlert size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase font-mono tracking-wider">Dangerous Territory</h4>
                      <p className="text-xs text-muted-foreground mt-1">Permanently delete this agent and all its data.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-red-500/50 text-red-500 text-[10px] font-mono uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                    Delete Agent
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      <div className="flex flex-col p-6 sm:p-10 max-w-7xl mx-auto w-full gap-8">
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Your Agents</h1>
            <p className="text-muted-foreground">Create custom versions of Bot Buddy focused on specific types of work.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all font-mono text-xs uppercase tracking-[0.15em] shadow-lg shadow-black/5"
          >
            <Plus size={16} />
            Create Agent
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-border pl-10 pr-4 py-2.5 focus:outline-none focus:border-foreground/30 transition-colors text-sm"
            />
          </div>
          <div className="flex border border-border p-1 bg-muted/20">
            {(['all', 'mine', 'shared'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest transition-all",
                  filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f === 'all' ? 'All' : f === 'mine' ? 'My Agents' : 'Shared'}
              </button>
            ))}
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent) => (
              <AgentCard 
                key={agent.id} 
                agent={agent} 
                onEdit={handleEdit}
                onChat={onStartChat}
              />
            ))}
          </AnimatePresence>
          {filteredAgents.length === 0 && (searchQuery || filter !== 'all') && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-full mx-auto">
                <Search size={24} className="text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium">No agents found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
              <button 
                onClick={() => { setSearchQuery(''); setFilter('all'); }}
                className="text-xs font-mono uppercase tracking-widest underline underline-offset-4 hover:text-foreground"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Background decoration matching dashboard style */}
      <div 
        aria-hidden
        className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none opacity-[0.03] dark:opacity-[0.07] z-0"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--foreground) 0, var(--foreground) 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}
      />
    </div>
  );
}
