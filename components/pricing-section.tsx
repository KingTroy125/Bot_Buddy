import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";

import Link from "next/link";

const starterFeatures = [
  "100 AI Queries / mo",
  "Standard Response Speed",
  "Web Search Access",
  "3 Chat Histories",
];

const scaleFeatures = [
  "Unlimited AI Queries",
  "Fastest Response Speed",
  "Priority API Access",
  "Unlimited History",
  "Custom Instructions",
];

export default function Pricing() {
  return (
    <section
      className={cn(
        "relative w-full",
        // intersection-2 grid: [fill] [pattern] [content] [pattern] [fill]
        "grid grid-cols-[1fr_1rem_minmax(0,64rem)_1rem_1fr]",
        "[--pattern-fg:color-mix(in_oklab,var(--color-gray-950),transparent_95%)]",
        "dark:[--pattern-fg:color-mix(in_oklab,var(--color-white),transparent_90%)]",
      )}
    >
      {/* ── Left patterned vertical strip ── */}
      <div
        aria-hidden
        className={cn(
          "col-start-2 row-span-full border-x",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
          "bg-[image:repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)]",
          "bg-[size:10px_10px] bg-fixed",
        )}
      />

      {/* ── Right patterned vertical strip ── */}
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

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 dark:bg-[radial-gradient(35%_80%_at_25%_0%,theme(colors.foreground/0.08),transparent)]">

          {/* Left: Heading */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Pricing
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground text-balance lg:text-4xl">
              Pricing that scales with you
            </h2>
          </div>

          {/* Middle: Starter Plan */}
          <div className="flex flex-col border-l border-r border-border">
            <div className="flex flex-col gap-4 p-8">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Starter
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  Free
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                For curious individuals
              </p>
              <Link href="/chat">
                <Button variant="outline" className="w-full">
                  Get started
                </Button>
              </Link>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="p-8">
              <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                Free, forever:
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {starterFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckIcon className="size-4 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Scale Plan */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-4 p-8">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Scale
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  $8
                </span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-muted-foreground text-sm">
                For power users
              </p>
              <Link href="/chat">
                <Button className="w-full">Get started</Button>
              </Link>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="p-8">
              <span className="text-muted-foreground text-[11px] font-medium tracking-wider uppercase">
                Everything in Starter, plus:
              </span>
              <ul className="mt-4 flex flex-col gap-3">
                {scaleFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckIcon className="size-4 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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