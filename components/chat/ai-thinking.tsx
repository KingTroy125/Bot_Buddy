"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const SCROLL_CONFIG = {
  SPEED: 5,
  INITIAL_DELAY: 100,
} as const;

const TIMER_CONFIG = {
  INTERVAL: 1000,
} as const;

const DIMENSIONS = {
  CARD_HEIGHT: "150px",
  FADE_HEIGHT: "80px",
} as const;

const THINKING_CONTENT = `Okay, first I need to understand what the user is asking. Let me carefully read through the conversation history and context to formulate an accurate and helpful response.

Analyzing the question and breaking it down into key components. I should consider multiple angles and perspectives to ensure a comprehensive answer.

Looking at the relevant information available. Cross-referencing different sources and approaches to find the most reliable and accurate path forward.

I should also consider edge cases and potential complications. It's important to address these proactively rather than leaving them for the user to discover.

Formulating the best possible response based on my analysis. I want to make sure this is clear, accurate, and genuinely helpful. Let me also think about the format — should I use bullet points, code blocks, or prose? 

The response should be structured logically, starting with the most important information and building from there. I'll also make sure to explain my reasoning so the user can follow along.

Reviewing my planned response to check for any gaps or inaccuracies. I want to make sure I haven't missed anything important and that the answer fully addresses what was asked.

Almost ready to respond. Final check on clarity and completeness...`;

function useTimer() {
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, TIMER_CONFIG.INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return timer;
}

function useAutoScroll(contentRef: React.RefObject<HTMLDivElement | null>) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!contentRef.current || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const initializeScroll = () => {
      if (!contentRef.current) return;

      const { scrollHeight, clientHeight } = contentRef.current;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      intervalRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + 1;
          return newPosition >= maxScroll ? 0 : newPosition;
        });
      }, SCROLL_CONFIG.SPEED);
    };

    const timeoutId = setTimeout(initializeScroll, SCROLL_CONFIG.INITIAL_DELAY);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contentRef]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition, contentRef]);

  return scrollPosition;
}

interface ThinkingHeaderProps {
  timer: number;
}

function ThinkingHeader({ timer }: ThinkingHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Spinner aria-hidden="true" className="size-4" />
      <span className="relative inline-block animate-pulse text-sm">
        BotBuddy is thinking...
      </span>
      <span
        aria-label={`${timer} seconds elapsed`}
        className="text-muted-foreground text-sm"
      >
        {timer}s
      </span>
    </div>
  );
}

interface FadeOverlayProps {
  position: "top" | "bottom";
}

function FadeOverlay({ position }: FadeOverlayProps) {
  const isTop = position === "top";
  const gradientClass = isTop
    ? "bg-gradient-to-b from-card from-30% to-transparent"
    : "bg-gradient-to-t from-card from-30% to-transparent";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 z-10 ${gradientClass}`}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height: DIMENSIONS.FADE_HEIGHT,
      }}
    />
  );
}

interface ThinkingContentProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  content: string;
}

function ThinkingContent({ contentRef, content }: ThinkingContentProps) {
  return (
    <div
      aria-label="AI thinking process"
      aria-live="polite"
      className="h-full overflow-hidden p-4 text-muted-foreground"
      ref={contentRef}
      role="log"
      style={{ scrollBehavior: "auto" }}
    >
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
    </div>
  );
}

interface ContentCardProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  content: string;
}

function ContentCard({ contentRef, content }: ContentCardProps) {
  return (
    <Card
      className="relative overflow-hidden rounded-none border-border p-2 shadow-none py-0"
      style={{ height: DIMENSIONS.CARD_HEIGHT }}
    >
      <FadeOverlay position="top" />
      <FadeOverlay position="bottom" />
      <ThinkingContent content={content} contentRef={contentRef} />
    </Card>
  );
}

export default function AIThinking({ className }: { className?: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const timer = useTimer();
  useAutoScroll(contentRef);

  return (
    <div className={cn("flex max-w-xl flex-col gap-3", className)}>
      <ThinkingHeader timer={timer} />
      <ContentCard content={THINKING_CONTENT} contentRef={contentRef} />
    </div>
  );
}
