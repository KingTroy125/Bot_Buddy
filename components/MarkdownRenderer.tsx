import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn(
      "prose max-w-none prose-p:leading-relaxed prose-pre:p-0 break-words",
      "text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground",
      className
    )}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <div className="mb-4 last:mb-0 text-[15px] leading-relaxed">{children}</div>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-border hover:decoration-foreground underline-offset-4 transition-colors font-medium">
              {children}
            </a>
          ),
          pre: ({ children, ...props }: any) => {
            const codeElement = React.isValidElement(children) ? children : null;
            const className = (codeElement?.props as any)?.className || '';
            const match = /language-(\w+)/.exec(className);
            const language = match ? match[1] : 'code';

            return (
              <div className="relative overflow-hidden bg-background border border-border my-4">
                <div className="flex items-center justify-between px-4 py-2 bg-muted text-muted-foreground text-[10px] tracking-widest uppercase font-mono border-b border-border">
                  <span>{language}</span>
                </div>
                <div className="p-4 overflow-x-auto custom-scrollbar">
                  <pre className="text-sm font-mono text-foreground bg-transparent p-0 m-0" {...props}>
                    {children}
                  </pre>
                </div>
              </div>
            );
          },
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isBlock = match || (typeof children === 'string' && children.includes('\n'));
            
            if (isBlock) {
              return <code className={className} {...props}>{children}</code>;
            }
            
            return (
              <code className="bg-muted text-foreground px-1.5 py-0.5 text-sm font-mono border border-border" {...props}>
                {children}
              </code>
            );
          },
          ul: ({ children }) => <ul className="list-disc pl-4 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-4">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-8 tracking-tight">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mb-4 mt-8 tracking-tight">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-bold mb-3 mt-6 tracking-tight">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-foreground pl-4 italic text-muted-foreground my-6">
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
