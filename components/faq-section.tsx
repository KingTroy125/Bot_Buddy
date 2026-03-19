"use client";

import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/ui/section-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions = [
  {
    id: "item-1",
    title: "What is BotBuddy?",
    content:
      "BotBuddy is an intelligent AI companion designed to help you quickly find answers, generate content, and boost your daily productivity.",
  },
  {
    id: "item-2",
    title: "What AI models does BotBuddy use?",
    content:
      "BotBuddy leverages the Gemini 3 Flash and Gemini 3.1 Pro families of models by Google, delivering cutting-edge performance and reasoning capabilities.",
  },
  {
    id: "item-3",
    title: "Is my data secure?",
    content:
      "Yes. Your chat logs and API keys are stored securely on your local device. We do not use your personal conversations to train our models without explicit consent.",
  },
  {
    id: "item-4",
    title: "Can I use my own API key?",
    content:
      "Yes! You can configure your own Gemini API key in the settings menu to use BotBuddy with your own Google Cloud billing account.",
  },
  {
    id: "item-5",
    title: "How do I get started?",
    content:
      "Simply click the 'Start Chatting' button anywhere on this page to jump right into the chat interface. No account is required to start exploring!",
  },
];

export default function FaqsSection() {
  return (
    <section
      className={cn(
        "relative w-full",
        "grid grid-cols-[1fr_0.5rem_minmax(0,64rem)_0.5rem_1fr]",
        "sm:grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]",
        "[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]",
        "dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]",
      )}
    >
      {/* ── Left patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-2 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Right patterned strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-4 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Content column ── */}
      <div className="col-start-3 flex flex-col">

        {/* Top dashed divider */}
        <div
          aria-hidden
          className={cn(
            "w-full border-t border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
          )}
        />

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:py-20">
          <SectionBadge label="Questions" />

          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Here are some common questions and answers you might have
            when getting started with BotBuddy.
          </p>
        </div>

        {/* Dashed divider between header and accordion */}
        <div
          aria-hidden
          className={cn(
            "w-full border-t border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
          )}
        />

        {/* ── Accordion ── */}
        <div className="px-4 py-10 sm:px-6 md:px-16 lg:px-24">
          <Accordion
            className="w-full"
            collapsible
            defaultValue="item-1"
            type="single"
          >
            {questions.map((item, i) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className={cn(
                  "relative border-b border-border transition-colors hover:bg-muted/30",
                  // cross mark at top-left of first item
                  i === 0 && "border-t",
                )}
              >
                <AccordionTrigger className="py-5 text-left text-sm font-medium text-foreground hover:no-underline sm:py-6 sm:text-base [&>svg]:text-muted-foreground">
                  <span className="flex items-center gap-3">
                    {/* Mono index number */}
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground/50 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-8 text-sm leading-relaxed text-muted-foreground sm:pb-6 sm:text-base">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Footer note */}
          <p className="mt-8 text-center font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Can't find what you're looking for?{" "}
            <a
              href="#"
              className="text-foreground underline-offset-4 hover:underline transition-colors"
            >
              Contact support
            </a>
          </p>
        </div>

        {/* Bottom dashed divider */}
        <div
          aria-hidden
          className={cn(
            "w-full border-b border-dashed",
            "[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
          )}
        />

      </div>
    </section>
  );
}