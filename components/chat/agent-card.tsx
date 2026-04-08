'use client';

import React from 'react';
import { Bot, MoreVertical, MessageSquare, Pin, Pencil } from 'lucide-react';
import { Agent } from './types';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onChat?: (agent: Agent) => void;
}

export function AgentCard({ agent, onEdit, onChat }: AgentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col bg-background border border-border overflow-hidden transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      {/* Card Header/Status Bar */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          {agent.isExample ? (
            <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-[9px] font-mono uppercase tracking-wider">Example</span>
          ) : (
            <span className="px-1.5 py-0.5 bg-foreground text-background text-[9px] font-mono uppercase tracking-wider">Owner</span>
          )}
          {agent.isPinned && <Pin size={10} className="text-muted-foreground fill-current rotate-45" />}
        </div>
        <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(agent); }}
            className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil size={12} />
          </button>
          <button className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <MoreVertical size={12} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-1">{agent.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-[40px]">
          {agent.description}
        </p>
      </div>

      {/* Card Footer - Fake Chat Input */}
      <div className="p-3 bg-muted/20 border-t border-border/50">
        <button
          onClick={() => onChat?.(agent)}
          className="w-full flex items-center gap-3 px-3 py-2 bg-background border border-border text-left text-xs text-muted-foreground font-medium transition-all hover:border-foreground/30 hover:text-foreground shadow-sm"
        >
          <PlusCircle size={14} className="opacity-50" />
          <span className="truncate">Chat with {agent.name}...</span>
          <ArrowUp size={14} className="ml-auto opacity-50" />
        </button>
      </div>
    </motion.div>
  );
}

// Icons for the fake input
function PlusCircle({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" />
    </svg>
  );
}

function ArrowUp({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
    </svg>
  );
}
